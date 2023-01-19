require("aeonian")
  .config({
    bucket: {
      localDir: "./build",
      prefix: "store.peoplecommerce.com.br-"
    },
    environments: {
      sandbox: "E35BR57SHJ2D4W",
      live: "E9AN7A01HWGMC",
      wineeventos: "E1M4JN4MCAJY9O"
    }
  })
  .deploy(process.argv[2]);
