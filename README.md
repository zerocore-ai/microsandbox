<a href="./#gh-dark-mode-only" target="_blank">
<img width="100%" src="./assets/microsandbox-banner-xl-dark.png" alt="microsandbox-banner-xl-dark">
</a>
<a href="./#gh-light-mode-only" target="_blank">
<img width="100%" src="./assets/microsandbox-banner-xl.png" alt="microsandbox-banner-xl">
</a>

<div align="center"><b>———&nbsp;&nbsp;&nbsp;easy secure execution of untrusted user/ai code&nbsp;&nbsp;&nbsp;———</b></div>
<br />
<div align='center'>
  <a href="https://docs.microsandbox.dev" target="_blank">
    <img src="https://img.shields.io/badge/documentation-%2300acee.svg?color=ff4500&style=for-the-badge&logo=gitbook&logoColor=white" alt=documentation style="margin-bottom: 5px;"/>
  </a>
  <a href="https://discord.gg/T95Y3XnEAK" target="_blank">
    <img src="https://img.shields.io/badge/discord -%2300acee.svg?color=mediumslateblue&style=for-the-badge&logo=discord&logoColor=white" alt=discord style="margin-bottom: 5px;"/>
  </a>
</div>

<div align='center'>
  <img src="https://img.shields.io/badge/macos-working-green?style=for-the-badge" alt=macos style="margin-bottom: 5px;"/>
  <img src="https://img.shields.io/badge/linux-working-green?style=for-the-badge" alt=linux style="margin-bottom: 5px;"/>
  <img src="https://img.shields.io/badge/windows-wip-red?style=for-the-badge" alt=windows style="margin-bottom: 5px;"/>
</div>
<br/>

## <img height="20" src="https://octicons-col.vercel.app/package/A770EF">&nbsp;Microsandbox

Microsandbox makes it **easy** to run untrusted workloads within a **hardware-isolated** and **fast startup** execution environment.

Running untrusted code securely is hard. Traditional solutions—containers, VMs, or cloud sandboxes—each trade off speed, isolation, or control. Microsandbox aims to give the best of all worlds.

> [!WARNING]
<<<<<<< Updated upstream
> This project is still **experimental**. Expect breaking changes, missing features, and rough edges.
=======
> Microsandbox is still **experimental software**. Expect breaking changes, missing features, and rough edges.
>>>>>>> Stashed changes

<br/>

## <img height="18" src="https://octicons-col.vercel.app/sparkle/A770EF">&nbsp;&nbsp;Key Features

- <img height="15" src="https://octicons-col.vercel.app/shield-lock/A770EF"> **Strong Isolation**: Hardware-level VM isolation with [microVMs](./MSB_V_DOCKER.md).
- <img height="15" src="https://octicons-col.vercel.app/zap/A770EF"> **Instant Startup**: Boot times under 200 ms.
- <img height="15" src="https://octicons-col.vercel.app/package/A770EF"> **OCI Compatible**: Runs standard container images.
- <img height="15" src="https://octicons-col.vercel.app/home/A770EF"> **Self-Hosted**: Deploy within your infrastructure with autonomy.
- <img height="15" src="https://octicons-col.vercel.app/dependabot/A770EF"> **AI-Ready**: Integrates seamlessly with agent and AI workflows via [MCP](./MCP.md).

Microsandbox is designed to be the execution backbone of the agentic web—fast, secure, and flexible.

<br/>

## <img height="18" src="https://octicons-col.vercel.app/device-desktop/A770EF">&nbsp;&nbsp;Demo

<div align='center'>
  <h4>Sandbox Environment</h4>
  <video src="https://github.com/user-attachments/assets/23618f92-5897-44d1-bfa6-1058f30c09ef" width="100%" controls></video>
  <sup><small><a href="https://asciinema.org/a/itQE92vIJiyq1PAPnaGURzDpv" target="_blank">[ASCIINEMA →]</a></small></sup>
</div>

<div align='center'>
  <h4>With Claude</h4>
  <img alt="Claude MCP Demo" src="https://github.com/user-attachments/assets/d91df12c-e425-48c0-a881-dec9a8d45868" width="100%"></img>
</div>

<br/>

## <img height="13" src="https://octicons-col.vercel.app/north-star/A770EF">&nbsp;&nbsp;Getting Started

#### PREREQUISITE

##### <img height="14" src="https://octicons-col.vercel.app/download/A770EF">&nbsp;&nbsp;1. Download `microsandbox`

```sh
curl -sSL https://get.microsandbox.dev | sh
```

##### <img height="14" src="https://octicons-col.vercel.app/play/A770EF">&nbsp;&nbsp;2. Start the server

```sh
msb server start --dev
```

##### <img height="14" src="https://octicons-col.vercel.app/cache/A770EF">&nbsp;&nbsp;3. Pull the environment image [Optional]

```sh
msb pull microsandbox/python
```

##

#### BASICS

`microsandbox` ships with a bunch of flexible commands to make it easy to manage and access sandboxes which are highlighted below

##### <img height="14" src="https://octicons-col.vercel.app/stopwatch/A770EF">&nbsp;&nbsp;Temporary Sandbox

For experimentation or one-off tasks, temporary sandboxes provide a clean environment that leaves no trace on exit. For example, create a sandbox based on the `microsandbox/python` image by running:

```sh
msx python # or `msb exe --image python`
```

##### <img height="14" src="https://octicons-col.vercel.app/pause/A770EF">&nbsp;&nbsp;System-wide Sandboxes

This provides the option to run long-lived sandboxes which are automatically setup as a system-wide executable. This also makes frequently used sandboxes incredibly convenient to access — no need to navigate to specific directories or remember complex commands.

```sh
msi python py-data # or `msb install --image alpine py-data`

py-data # From any directory, run the sandbox
```

> If no alias is specified, the image name is used as the default. In the example above, this will be `python`. If a sandbox with similar name exists, an error will be returned.

> [!TIP]
>
> Run `msb <subcommand> --help` to see all the options available for a subcommand.
>
> For example, `msb add --help`.

<br/>

## <img height="18" src="https://octicons-col.vercel.app/package-dependencies/A770EF">&nbsp;&nbsp;SDK&nbsp;&nbsp;<sup><sup>BETA</sup></sup>

##### <img height="14" src="https://octicons-col.vercel.app/move-to-bottom/A770EF">&nbsp;&nbsp;1. Install the SDK

> See open issues for future language support.

| Language   | Instruction                |
| ---------- | -------------------------- |
| Python     | `pip install microsandbox` |
| Rust       | `cargo add microsandbox`   |
| JavaScript | `npm install microsandbox` |

##### <img height="14" src="https://octicons-col.vercel.app/file-binary/A770EF">&nbsp;&nbsp;2. Execute the Code

> The first run pulls the environment image, so it’ll take a bit longer. You can pre-pull an image it to make runs instant. For more information on how to use the SDK, refer to the [SDK Readme](./sdk/README.md).

##### Python

```py
import asyncio
from microsandbox import PythonSandbox

async def main():
    async with PythonSandbox.create(name="test") as sb:
        exec = await sb.run("name = 'Python'")
        exec = await sb.run("print(f'Hello {name}!')")

    print(await exec.output()) # prints Hello Python!

asyncio.run(main())
```

##### JavaScript

```js
import { NodeSandbox } from "microsandbox";

async function main() {
  const sb = await NodeSandbox.create({ name: "test" });

  try {
    let exec = await sb.run("var name = 'JavaScript'");
    exec = await sb.run("console.log(`Hello ${name}!`)");

    console.log(await exec.output()); // prints Hello JavaScript!
  } finally {
    await sb.stop();
  }
}

main().catch(console.error);
```

##### Rust

```rs
use microsandbox::{SandboxOptions, PythonSandbox};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let options = SandboxOptions::builder().name("test").build();
    let mut sb = PythonSandbox::create(options).await?;

    let exec = sb.run(r#"name = "Python""#).await?;
    let exec = sb.run(r#"print(f"Hello {name}!")"#).await?;

    println!("{}", exec.output().await?); // prints Hello Python!

    sb.stop().await?;

    Ok(())
}
```

<br/>

## <img height="18" src="https://octicons-col.vercel.app/space/A770EF">&nbsp;&nbsp;Project Sandbox&nbsp;&nbsp;<sup><sup>BETA</sup></sup>

Beyond the SDK, microsandbox supports project-based development with the familiar package-manager workflow devs are used to. Think of it like `npm` or `cargo`, but for sandboxes!

#### QUICK DEMO

<div align="center">
  <a href="https://asciinema.org/a/7eOFf2Ovigi473FsKgr3Lpve1" target="_blank"><img src="https://github.com/user-attachments/assets/3a9d1de4-2370-4d5a-a40d-9aa7315aa934" width="100%"/></a>
</div>

##

#### SETUP GUIDE

##### <img height="14" src="https://octicons-col.vercel.app/plus-circle/A770EF">&nbsp;&nbsp;1. Create a Sandbox Project

Each sandbox project needs a file, `Sandboxfile` at the root of the project directory, which serves as the configuration manifest for your sandbox environments. To initialize one, run:

```sh
msb init
```

##### <img height="14" src="https://octicons-col.vercel.app/file-added/A770EF">&nbsp;&nbsp;2. Add a Sandbox to the Project

Proceed to register a new `python` sandbox named `app` in your `Sandboxfile`.

```sh
msb add app \
    --image python \
    --cpus 1 \
    --memory 1024 \
    --start 'python -c "print(\"hello\")"'
```

##### <img height="14" src="https://octicons-col.vercel.app/codescan/A770EF">&nbsp;&nbsp;3. Inspect `Sandboxfile`

The newly created sandbox, `app` should be registered in your `Sandboxfile`. If there was a pre-existing `Sandboxfile`, it'd be appended to it. It should be similar to this:

```yaml
sandboxes:
  app:
    image: python
    memory: 1024
    cpus: 1
    scripts:
      start: python -c "print(\"hello\")"
```

##### <img height="14" src="https://octicons-col.vercel.app/zap/A770EF">&nbsp;&nbsp;4. Running a Project-Defined Sandbox

Next is to run a sandbox defined in your project. This would execute the default _start_ script of your sandbox. For more control, you can directly specify which script to run e.g. `msr app~start`.

```sh
msr app # or `msb run --sandbox app`
```

> When running project sandboxes, all file changes and installations made inside the sandbox are automatically persisted to the `./menv` directory. This means you can stop and restart your sandbox any time without losing your work. Your development environment will be exactly as you left it.

<br/>

<<<<<<< Updated upstream

## <img height="18" src="https://octicons-col.vercel.app/light-bulb/A770EF">&nbsp;&nbsp;Uninstall

To uninstall microsandbox, run: `msb self uninstall`. Use the `--force` flag. This removes the `$HOME/.microsandbox` directory and all its content, effectively cleaning up all cached microsandbox data such as images, layers, and databases.

Refer to the [maintenance docs](./docs/references/cli.md#maintenance) for other types of cleanups.

<br/>

## <img height="18" src="https://octicons-col.vercel.app/light-bulb/A770EF">&nbsp;&nbsp;Use Cases

Wondering how you can use `microsandbox` in your next project, see our sample [use cases](./USE_CASE.md).

<br/>

## <img height="18" src="https://octicons-col.vercel.app/gear/A770EF">&nbsp;&nbsp;Contributing

Interested in contributing to `microsandbox`? Check out our [Development Guide](./DEVELOPMENT.md) for instructions on setting up your development environment, building the project, running tests, and creating releases. For contribution guidelines, please refer to [CONTRIBUTING.md](./CONTRIBUTING.md).

<br/>

=======

## <img height="18" src="https://octicons-col.vercel.app/light-bulb/A770EF">&nbsp;&nbsp;Use Cases

Wondering how you can use `microsandbox` in your next project, see our sample [use cases](./USE_CASE.md).

<br/>

## <img height="18" src="https://octicons-col.vercel.app/gear/A770EF">&nbsp;&nbsp;Contributing

Interested in contributing to `microsandbox`? Check out our [Development Guide](./DEVELOPMENT.md) for instructions on setting up your development environment, building the project, running tests, and creating releases. For contribution guidelines, please refer to [CONTRIBUTING.md](./CONTRIBUTING.md).

<br/>

> > > > > > > Stashed changes

## <img height="18" src="https://octicons-col.vercel.app/law/A770EF">&nbsp;&nbsp;License

This project is licensed under the [Apache License 2.0](./LICENSE).

<br/>

## <img height="18" src="https://octicons-col.vercel.app/heart/A770EF">&nbsp;&nbsp;Ackowledgements

Special thanks to all our contributors, testers, and community members who help make microsandbox better every day! We'd like to thank the following projects and communities that made `microsandbox` possible:

- **[libkrun](https://github.com/containers/libkrun)**: The lightweight virtualization library that powers our secure microVM isolation
