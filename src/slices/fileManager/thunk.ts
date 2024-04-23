import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Include Both Helper File with needed methods
import { Utils } from '@helpers/utils';

export const getFolders = createAsyncThunk('fileManager/getFolders', async () => {
  try {
    const response = await Utils.loadJSON('demo/data/fileManager').then(data => data.folderList);
    return response;
  } catch (error) {
    return error;
  }
});

export const addNewFolder = createAsyncThunk(
  'fileManager/addNewFolder',
  async (folder: null | undefined | string | {}) => {
    try {
      const response = true; //addNewFolderApi(folder);
      toast.success('Folder Added Successfully', { autoClose: 3000 });
      return response;
    } catch (error) {
      toast.error('Folder Added Failed', { autoClose: 3000 });
      return error;
    }
  },
);

export const updateFolder = createAsyncThunk(
  'fileManager/updateFolder',
  async (folder: null | undefined | string | {}) => {
    try {
      const response = true; //updateFolderApi(folder);
      toast.success('Folder Updated Successfully', { autoClose: 3000 });
      return response;
    } catch (error) {
      toast.error('Folder Updated Failed', { autoClose: 3000 });
      return error;
    }
  },
);

export const deleteFolder = createAsyncThunk(
  'fileManager/deleteFolder',
  async (folder: null | undefined | string | {}) => {
    try {
      const response = true; //deleteFolderApi(folder);
      toast.success('Order Deleted Successfully', { autoClose: 3000 });
      return response;
    } catch (error) {
      toast.error('Order Deleted Failed', { autoClose: 3000 });
      return error;
    }
  },
);

export const getFiles = createAsyncThunk('fileManager/getFiles', async () => {
  try {
    const response = await Utils.loadJSON('demo/data/fileManager').then(data => data.recentFile);
    return response;
  } catch (error) {
    return error;
  }
});

export const addNewFile = createAsyncThunk('fileManager/addNewFile', async (file: null | undefined | string | {}) => {
  try {
    const response = true; //addNewFileApi(file);
    toast.success('File Added Successfully', { autoClose: 3000 });
    return response;
  } catch (error) {
    toast.error('File Added Failed', { autoClose: 3000 });
    return error;
  }
});

export const updateFile = createAsyncThunk('fileManager/updateFile', async (file: null | undefined | string | {}) => {
  try {
    const response = true; //updateFileApi(file);
    toast.success('File Updated Successfully', { autoClose: 3000 });
    return response;
  } catch (error) {
    toast.error('File Updated Failed', { autoClose: 3000 });
    return error;
  }
});

export const deleteFile = createAsyncThunk('fileManager/deleteFile', async (file: null | undefined | string | {}) => {
  try {
    const response = true; //deleteFileApi(file);
    toast.success('File Delete Successfully', { autoClose: 3000 });
    return response;
  } catch (error) {
    toast.error('File Delete Failed', { autoClose: 3000 });
    return error;
  }
});
