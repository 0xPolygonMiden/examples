# Benchmarking CLI for Miden Examples

This is a simple CLI that enables users to benchmark the Miden examples. You can run any example in https://github.com/0xPolygonMiden/examples/tree/main/examples. 

## Usage
To run the fibonacci example, you can either run

```
cargo build
```

and then 

```
./target/debug/miden-benchmarking-cli --example fibonacci
```

OR you run 

```
cargo run -- -e fibonacci   
```

You can pass two additional parameters to the CLI `security` and `output`. `security` can be `"high"` for 128-bit security and will default to 96-bit. `output` defines the number of stack outputs the program returns. It defaults to 1. 

In general the CLI works as follows:

`miden-benchmarking-cli --example <EXAMPLE> --security <SECURITY>`

```
Options:
  -e, --example <EXAMPLE>    Provide example name as in ../examples
  -s, --security <SECURITY>  Set to 'high' if 128-bit is needed [default: ]
  -o, --output <OUTPUT>      Set the number of desired stack outputs [default: 1]
  -h, --help                 Print help information
  -V, --version              Print version information
```
