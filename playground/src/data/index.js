const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const { marked } = require('marked'); // Correct import for marked

const REPO_URL =
  'https://api.github.com/repos/0xPolygonMiden/miden-vm/contents/docs/src/user_docs';

async function fetchFileList(url) {
  try {
    const response = await axios.get(url);
    const files = response.data;
    const markdownFiles = [];

    // markdownFiles.push(FILE_URL);

    for (const file of files) {
      if (file.type === 'file' && file.name.endsWith('.md')) {
        markdownFiles.push(file.download_url);
      } else if (file.type === 'dir') {
        const nestedFiles = await fetchFileList(file.url);
        markdownFiles.push(...nestedFiles);
      }
    }

    return markdownFiles;
  } catch (error) {
    console.error('Error fetching file list:', error);
    throw error;
  }
}

async function fetchMarkdown(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching markdown from', url, ':', error);
    throw error;
  }
}

function stripHtmlTags(str) {
  return str.replace(/<[^>]*>?/gm, '');
}

function parseTables(markdown) {
  const html = marked(markdown);
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const tables = document.querySelectorAll('table');

  if (tables.length === 0) {
    console.warn('No tables found in the markdown.');
    return [];
  }

  const tableData = Array.from(tables).map((table) => {
    const headers = Array.from(table.querySelectorAll('thead tr th')).map(
      (th) => stripHtmlTags(th.textContent.trim())
    );
    const rows = Array.from(table.querySelectorAll('tbody tr')).map((tr) => {
      const cells = tr.querySelectorAll('td');
      const rowData = {};
      cells.forEach((cell, i) => {
        rowData[headers[i]] = stripHtmlTags(
          cell.innerHTML.trim().replace(/<br>/g, '\n')
        );
      });
      return rowData;
    });

    return { headers, data: rows };
  });

  return tableData;
}

function getClassNames(markdown) {
  const lines = markdown.split('\n');
  const classNames = [];
  lines.forEach((line) => {
    const match = line.match(/^###\s+(.*)/);
    if (match) {
      classNames.push(match[1].trim());
    }
  });
  return classNames;
}

function processTables(tableData, classNames) {
  return tableData.map((table, index) => {
    const className = classNames[index] || 'Procedures';

    const instructions = table.data.map((row) => ({
      instruction: row['Instruction'] || '',
      stackInput: row['Stack_input'] || '',
      stackOutput: row['Stack_output'] || '',
      cycles: (row['Instruction']?.match(/\((\d+)\s+cycles?\)/) || [])[1] || '',
      notes: row['Notes'] || ''
    }));

    return {
      class: className,
      instructions
    };
  });
}

async function main() {
  try {
    const fileUrls = await fetchFileList(REPO_URL);
    console.log(`Found ${fileUrls.length} markdown files.`);
    const allTableData = [];

    for (const url of fileUrls) {
      try {
        console.log(`Fetching markdown from ${url}`);
        const markdown = await fetchMarkdown(url);
        const tableData = parseTables(markdown);
        if (tableData.length > 0) {
          const classNames = getClassNames(markdown);
          console.log(`Parsed ${tableData.length} tables from ${REPO_URL}`);
          const processedTables = processTables(tableData, classNames);
          const jsonData = JSON.stringify(processedTables, null, 2);

          allTableData.push(...processedTables);
        } else {
          console.log(`No tables found in ${REPO_URL}`);
        }
      } catch (error) {
        console.error(`Error processing ${url}:`, error);
      }
    }

    const tsxContent = `export const assemblerInstructions = ${JSON.stringify(
      allTableData,
      null,
      2
    )};`;

    fs.writeFileSync(
      path.resolve(__dirname, 'instructions.tsx'),
      tsxContent,
      'utf-8'
    );
    console.log('Data saved to Instructions.tsx');
  } catch (error) {
    console.error('Error in main function:', error);
  }
}

main();
