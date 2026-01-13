# Uploads Directory

This directory handles file uploads for the MediConnect application.

## Structure
- `temp/` - Temporary storage for files during upload processing
- `prescriptions/` - Local storage for prescription files (fallback)
- `profiles/` - Local storage for profile pictures (fallback)

## Security Notes
- All files are validated before processing
- Uploaded files are automatically deleted after processing
- In production, files are primarily stored in Cloudinary
- Local storage is used as fallback for development

## File Validation
- Max file size: 10MB
- Allowed types: JPG, PNG, GIF, PDF
- File names are sanitized and randomized