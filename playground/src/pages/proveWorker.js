import init, { prove_program } from 'miden-wasm';

onmessage = async function (e) {
  const { code, inputs } = e.data;

  try {
    await init();
    const start = Date.now();
    const {
      program_hash,
      cycles,
      stack_output,
      trace_len,
      overflow_addrs,
      proof
    } = prove_program(code, inputs);
    const overflow = overflow_addrs ? overflow_addrs.toString() : '[]';
    const duration = Date.now() - start;

    postMessage({
      success: true,
      result: {
        programInfo: {
          program_hash,
          cycles,
          trace_len
        },
        output: `{
            "stack_output" : [${stack_output.toString()}],
            "overflow_addrs" : [${overflow}],
            "trace_len" : ${trace_len}
          }`,
        proof,
        stackOutput: stack_output.toString(),
        duration
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    postMessage({ success: false, error: errorMessage });
  }
};
