/**
 * S3 Upload Service
 * Handles image uploads via API Gateway + Lambda to S3 bucket
 */

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

// S3 upload service using API Gateway + Lambda
export class S3Upload {
  private apiEndpoint: string;
  private bucketName: string;
  private region: string;

  constructor() {
    this.apiEndpoint = process.env.NEXT_PUBLIC_UPLOAD_API_ENDPOINT || 'https://u3iysopa88.execute-api.us-east-1.amazonaws.com/upload';
    this.bucketName = 'retromobilegamingproject';
    this.region = 'us-east-1';
  }

  /**
   * Upload image using API Gateway + Lambda
   */
  async uploadImage(file: File, folder: 'games' | 'consoles'): Promise<UploadResult> {
    try {
      // Validate file client-side first
      if (!this.isValidImageFile(file)) {
        return {
          success: false,
          error: 'Invalid file type. Please upload an image (JPG, PNG, GIF, WebP).'
        };
      }

      if (!this.isValidFileSize(file)) {
        return {
          success: false,
          error: 'File size too large. Please upload an image smaller than 5MB.'
        };
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      // Upload via API Gateway
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let browser set it with boundary
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          url: result.url
        };
      } else {
        const error = await response.json();
        return {
          success: false,
          error: error.error || 'Upload failed'
        };
      }

    } catch (error) {
      return {
        success: false,
        error: `Upload failed: ${error instanceof Error ? error.message : 'Network error'}`
      };
    }
  }

  /**
   * Upload multiple images
   */
  async uploadMultipleImages(files: File[], folder: 'games' | 'consoles'): Promise<UploadResult[]> {
    const uploadPromises = files.map(file => this.uploadImage(file, folder));
    return Promise.all(uploadPromises);
  }

  /**
   * Delete image from S3 bucket
   */
  async deleteImage(imageUrl: string): Promise<UploadResult> {
    try {    
      // Extract the S3 key from the URL
      const s3Key = this.extractS3KeyFromUrl(imageUrl);
      
      if (!s3Key) {
        return {
          success: false,
          error: 'Invalid S3 URL format'
        };
      }

      // Call the upload endpoint with DELETE method
      const response = await fetch(this.apiEndpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          key: s3Key,
          bucket: this.bucketName 
        }),
      });

      if (response.ok) {
        return {
          success: true
        };
      } else {
        const error = await response.json();
        return {
          success: false,
          error: error.error || 'Delete failed'
        };
      }

    } catch (error) {
      return {
        success: false,
        error: `Delete failed: ${error instanceof Error ? error.message : 'Network error'}`
      };
    }
  }

  /**
   * Delete multiple images from S3
   */
  async deleteMultipleImages(imageUrls: string[]): Promise<UploadResult[]> {
    const deletePromises = imageUrls.map(url => this.deleteImage(url));
    return Promise.all(deletePromises);
  }

  /**
   * Validate if file is a valid image
   */
  private isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return validTypes.includes(file.type);
  }

  /**
   * Validate if file size is within limits (5MB max)
   */
  private isValidFileSize(file: File): boolean {
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    return file.size <= maxSizeInBytes;
  }

  /**
   * Extract S3 key from S3 URL
   */
  private extractS3KeyFromUrl(url: string): string | null {
    try {
      // Handle different S3 URL formats:
      // https://bucket-name.s3.region.amazonaws.com/key
      // https://s3.region.amazonaws.com/bucket-name/key
      // https://bucket-name.s3.amazonaws.com/key
      
      const urlObj = new URL(url);
      
      // Format: https://bucket-name.s3.region.amazonaws.com/key
      if (urlObj.hostname.startsWith(this.bucketName)) {
        return urlObj.pathname.substring(1); // Remove leading slash
      }
      
      // Format: https://s3.region.amazonaws.com/bucket-name/key
      if (urlObj.hostname.includes('s3') && urlObj.pathname.startsWith(`/${this.bucketName}/`)) {
        return urlObj.pathname.substring(`/${this.bucketName}/`.length);
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }
}

// Export singleton instance
export const s3Upload = new S3Upload();
