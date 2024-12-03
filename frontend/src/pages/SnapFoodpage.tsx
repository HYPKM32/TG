import React, { useRef, useState } from 'react';
import { Camera, Upload } from 'lucide-react';

const SnapFoodPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // 카메라 시작
  const startCamera = async () => {
    setIsLoading(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError('');
    } catch (err) {
      setError('카메라를 시작할 수 없습니다. 파일 업로드를 이용해주세요.');
      console.error('Camera error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 파일 선택 처리
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setCapturedImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setError('이미지 파일만 선택할 수 있습니다.');
      }
    }
  };

  // 카메라 정지
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  // 사진 촬영
  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  // 다시 시도
  const retake = () => {
    setCapturedImage(null);
    if (stream) {
      startCamera();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">식재료 촬영</h1>
          <p className="text-gray-600">사진을 촬영하거나 업로드하세요</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {!stream && !capturedImage && (
            <div className="text-center p-8 border-2 border-dashed border-blue-200 rounded-lg">
              <div className="space-y-4">
                {/* 카메라 촬영 버튼 */}
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  disabled={isLoading}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300 w-full"
                >
                  <Camera className="w-6 h-6 inline-block mr-2" />
                  {isLoading ? '카메라 켜는 중...' : '카메라로 촬영하기'}
                </button>
                
                <div className="text-gray-500">또는</div>
                
                {/* 갤러리 업로드 버튼 */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-300 w-full"
                >
                  <Upload className="w-6 h-6 inline-block mr-2" />
                  갤러리에서 선택하기
                </button>
                
                {/* 카메라 입력 */}
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {/* 갤러리 입력 */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {stream && !capturedImage && (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg"
              />
              <button
                onClick={captureImage}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors duration-300"
              >
                촬영하기
              </button>
            </div>
          )}

          {capturedImage && (
            <div className="relative">
              <img
                src={capturedImage}
                alt="촬영된 식재료"
                className="w-full rounded-lg"
              />
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={retake}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors duration-300"
                >
                  다시 찍기
                </button>
                <button
                  onClick={() => {/* 여기에 이미지 저장/분석 로직 추가 */}}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                >
                  사용하기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SnapFoodPage;