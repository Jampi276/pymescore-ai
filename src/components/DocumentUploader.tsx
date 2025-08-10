import React, { useState, useRef } from 'react';
import { Upload, File, X, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DocumentUploaderProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile: File | null;
  isLoading?: boolean;
  error?: string;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onFileSelect,
  onFileRemove,
  selectedFile,
  isLoading = false,
  error
}) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelection(files[0]);
    }
  };
  
  const handleFileSelection = (file: File) => {
    // Validar tipo de archivo
    if (file.type !== 'application/pdf') {
      return;
    }
    
    // Validar tamaño (máximo 16MB)
    if (file.size > 16 * 1024 * 1024) {
      return;
    }
    
    onFileSelect(file);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelection(files[0]);
    }
  };
  
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  return (
    <div className="space-y-4">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Upload Area */}
      {!selectedFile ? (
        <Card>
          <CardContent className="p-6">
            <div
              className={`
                relative border-2 border-dashed rounded-lg p-8 text-center transition-smooth cursor-pointer
                ${dragActive 
                  ? 'border-brandPrimary bg-brandPrimary/5' 
                  : 'border-gray-300 hover:border-brandPrimary hover:bg-brandPrimary/5'
                }
                ${isLoading ? 'opacity-50 pointer-events-none' : ''}
              `}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={openFileDialog}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleInputChange}
                className="hidden"
                disabled={isLoading}
              />
              
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-brandPrimary/10 rounded-full flex items-center justify-center">
                  <Upload className="h-8 w-8 text-brandPrimary" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Cargar Estado Financiero (PDF)
                  </h3>
                  <p className="text-sm text-gray-600">
                    Arrastra y suelta tu archivo PDF aquí, o haz clic para seleccionar
                  </p>
                  <p className="text-xs text-gray-500">
                    Solo archivos PDF, máximo 16MB
                  </p>
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="mt-4"
                  disabled={isLoading}
                >
                  Seleccionar Archivo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* File Preview */
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-brandAccent/10 rounded-lg">
                  <File className="h-6 w-6 text-brandAccent" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 truncate max-w-xs">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-brandAccent" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onFileRemove}
                  disabled={isLoading}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Información adicional */}
      <div className="text-xs text-gray-600 space-y-1">
        <p>• El archivo debe ser un estado financiero descargado de la SCVS</p>
        <p>• Formato PDF únicamente</p>
        <p>• Los datos se procesan de forma segura y confidencial</p>
      </div>
    </div>
  );
};