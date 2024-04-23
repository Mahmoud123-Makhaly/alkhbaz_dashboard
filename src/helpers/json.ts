import fsPromises from 'fs/promises';
import path from 'path';
const ReadFile = async (pathName: string) => {
  const dataFilePath = path.join(process.cwd(), pathName);
  // Read the existing data from the JSON file
  return fsPromises.readFile(dataFilePath).then(
    data => data.toString(),
    err => err,
  );
};

const WriteFile = async (pathName: string, data: string) => {
  const dataFilePath = path.join(process.cwd(), pathName);
  return fsPromises.writeFile(dataFilePath, JSON.stringify(data)).then(
    () => true,
    err => err,
  );
};

export const JManager = {
  ReadFile,
};
