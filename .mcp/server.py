import asyncio
import os
from mcp.server.fastmcp import FastMCP

# ---------------------------------------------------------------------------
# Server instance
# ---------------------------------------------------------------------------

mcp = FastMCP("leveluplearning")

# Workspace root (set WORKSPACE or fall back to parent of this file)
WORKSPACE = os.getenv(
    "WORKSPACE",
    None
)


@mcp.tool()
async def run_pytest() -> str:
    """Run all Pytest tests and return the full output."""
    api_dir = os.path.join(WORKSPACE, "api")
    command = (
        "export PYTHONPATH=. && "
        "export $(grep -v '^#' .env.dev | xargs) && "
        "source virt/bin/activate && "
        "pytest"
    )
    proc = await asyncio.create_subprocess_shell(
        command,
        cwd=api_dir,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.STDOUT,
        executable="/bin/bash",
    )
    stdout, _ = await proc.communicate()
    return stdout.decode()


if __name__ == "__main__":
    mcp.run()
