@ECHO OFF
setlocal

rem Step 1: Get the current branch name
for /f "tokens=*" %%A in ('git branch --show-current') do set current_branch=%%A

rem Step 2: Check if the current branch is 'feature/demo'
if /i "%current_branch%" neq "feature/demo" (
  echo You are not on the 'feature/demo' branch. Aborting.
  exit /b
)

rem Step 3: Discard local changes and untracked files
git reset --hard HEAD
git clean -f -d

rem Step 4: Checkout the current branch
git checkout .

rem Step 5: Pull the latest changes from the remote repository
git pull --all

rem Step 6: Check if port 8090 is available
netstat -ano | find "LISTENING" | find "8090"
if errorlevel 1 (
  echo Port 8090 is not in use. Proceeding...
) else (
  echo Port 8090 is already in use. Aborting.
  exit /b
)

rem Step 7: Build the project using Yarn
yarn build

rem Step 8: Start the application using Yarn (adjust the script as needed)
start "" yarn start

rem Keep the command prompt open
PAUSE
