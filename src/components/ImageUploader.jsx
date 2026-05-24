import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle, Loader, ImageIcon } from 'lucide-react';

// Compress & resize image using Canvas API - no external service needed
async function compressImage(file, maxWidth = 900, quality = 0.78) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      // Calculate new dimensions keeping aspect ratio
      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Export as JPEG for smaller size
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(dataUrl);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

export default function ImageUploader({
  onUpload,
  label = 'Upload Image',
  currentImage = ''
}) {
  const [status, setStatus] = useState(currentImage ? 'done' : 'idle');
  const [preview, setPreview] = useState(currentImage || '');
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState('');
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPG, PNG, WEBP).');
      setStatus('error');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setErrorMsg('File too large. Max size is 20MB.');
      setStatus('error');
      return;
    }

    setStatus('uploading');
    setErrorMsg('');
    setProgress('Reading image...');

    try {
      // Show instant local preview
      const localUrl = URL.createObjectURL(file);
      setPreview(localUrl);

      setProgress('Compressing...');
      // Compress image using canvas
      const compressed = await compressImage(file);

      setPreview(compressed);
      setStatus('done');
      setProgress('');
      onUpload(compressed);
    } catch (err) {
      console.error('Image processing error:', err);
      setErrorMsg('Could not process image. Please try another file.');
      setStatus('error');
      setPreview('');
      setProgress('');
    }
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const clearImage = () => {
    setPreview('');
    setStatus('idle');
    setErrorMsg('');
    setProgress('');
    onUpload('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-brand-dark/70 mb-1">
        {label}
      </label>

      {/* Preview State */}
      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="h-36 w-36 object-cover rounded-xl border-2 border-brand-wood/30 shadow-md"
          />

          {/* Status badges */}
          <div className="absolute -top-2 -right-2 flex items-center gap-1">
            {status === 'uploading' && (
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-wood shadow-lg">
                <Loader size={14} className="text-white animate-spin" />
              </span>
            )}
            {status === 'done' && (
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 shadow-lg">
                <CheckCircle size={14} className="text-white" />
              </span>
            )}
            <button
              type="button"
              onClick={clearImage}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500 shadow-lg hover:bg-red-600 transition-colors"
              title="Remove image"
            >
              <X size={13} className="text-white" />
            </button>
          </div>

          {/* Uploading overlay */}
          {status === 'uploading' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
              <div className="flex flex-col items-center gap-1.5">
                <Loader size={22} className="text-white animate-spin" />
                <span className="text-[10px] text-white font-semibold">{progress}</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Drop Zone */
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 cursor-pointer transition-all duration-200 select-none ${
            isDragging
              ? 'border-brand-wood bg-brand-beige/40 scale-[1.02] shadow-inner'
              : 'border-brand-wood/30 bg-brand-light/60 hover:border-brand-wood hover:bg-brand-beige/20'
          }`}
        >
          {isDragging ? (
            <ImageIcon size={28} className="text-brand-wood animate-bounce" />
          ) : (
            <Upload size={28} className="text-brand-wood/50" />
          )}
          <div className="text-center">
            <p className="text-xs font-semibold text-brand-dark/70">
              {isDragging ? 'Drop image here!' : 'Click to upload or drag & drop'}
            </p>
            <p className="text-[10px] text-brand-dark/40 mt-0.5">
              JPG, PNG, WEBP — auto compressed for fast loading
            </p>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      {/* Error message */}
      {status === 'error' && (
        <p className="text-xs text-red-500 font-medium flex items-center gap-1">
          <X size={12} /> {errorMsg}
        </p>
      )}

      {/* Success message */}
      {status === 'done' && (
        <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
          <CheckCircle size={12} /> Image ready — compressed &amp; optimized
        </p>
      )}
    </div>
  );
}
