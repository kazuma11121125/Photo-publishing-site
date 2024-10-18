import os
import subprocess

class GitFileHandler:
    MAX_SIZE = 1_000_000_000  # 1GB in bytes
    COMMIT_MESSAGE = "写真追加"

    def __init__(self):
        self.current_size = 0
        self.file_list = []

    def get_file_size(self, file_path):
        """Returns the size of the file in bytes."""
        return os.path.getsize(file_path)

    def run_git_command(self, command):
        """Runs a git command and returns the output."""
        return subprocess.check_output(command, shell=True).decode().splitlines()

    def stage_files(self):
        """Stages the files using git add."""
        if self.file_list:
            subprocess.run(["git", "add"] + self.file_list)
            print(f"Staged {len(self.file_list)} files.")

    def commit_changes(self):
        """Commits the staged files with a specified commit message."""
        subprocess.run(["git", "commit", "-m", self.COMMIT_MESSAGE])
        print(f"Committed with message: '{self.COMMIT_MESSAGE}'")

    def push_changes(self):
        """Pushes the committed changes to the main branch."""
        subprocess.run(["git", "push", "origin", "main"])
        print("Changes pushed to 'origin main'.")

    def process_files(self):
        """Processes the modified or untracked files."""
        modified_files = self.run_git_command("git ls-files --modified --others --exclude-standard")

        for file in modified_files:
            file_size = self.get_file_size(file)

            # Check if adding this file exceeds the 1GB limit
            if self.current_size + file_size < self.MAX_SIZE:
                self.file_list.append(file)
                self.current_size += file_size
            else:
                # Stage the current batch of files
                self.stage_files()
                self.commit_changes()  # Commit after staging a batch
                self.push_changes()    # Push after committing
                self.file_list = [file]  # Start a new batch with the current file
                self.current_size = file_size

        # Stage, commit, and push the remaining files
        if self.file_list:
            self.stage_files()
            self.commit_changes()
            self.push_changes()

def main():
    git_handler = GitFileHandler()
    git_handler.process_files()

if __name__ == "__main__":
    main()
