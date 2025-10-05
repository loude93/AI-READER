
import React, { useRef } from 'react';
import { UploadIcon } from './icons';

interface FileUploadProps {
  onFolderSelect: (files: FileList) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFolderSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFolderSelect(files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className="border-2 border-dashed border-slate-600 rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 hover:border-cyan-400 hover:bg-slate-700/50"
      onClick={handleClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        webkitdirectory=""
        directory=""
      />
      <div className="flex flex-col items-center">
        <UploadIcon className="w-16 h-16 text-slate-500 mb-4 transition-colors duration-300 group-hover:text-cyan-400" />
        <p className="text-xl font-semibold text-slate-300">
          <span className="text-cyan-400">Click to upload</span> or drag and drop a folder
        </p>
        <p className="text-slate-400 mt-2">
          Upload a project folder to get started.
        </p>
      </div>
    </div>
  );
};

export default FileUpload;
