import React, { useRef, useState } from 'react';
import { Camera, Upload, Loader } from 'lucide-react';
import { processImage, getAllFridges } from '../api/client';

const SnapFoodPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [labels, setLabels] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fridges, setFridges] = useState<Array<{ _id: string; name: string }>>([]);
  const [showFridgeSelection, setShowFridgeSelection] = useState(false);

  // base64 문자열을 File 객체로 변환하는 함수
  const base64ToFile = (base64String: string): File => {
    const arr = base64String.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], 'captured-image.jpg', { type: mime });
  };

  // 카메라 시작
  const startCamera = async () => {
    try {
      const mediaStream = await (navigator as any).mediaDevices.getUserMedia({
        video: {
          facingMode: { exact: 'environment' }
        }
      });
  
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.setAttribute('autoplay', '');
        videoRef.current.setAttribute('playsinline', '');
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('후면 카메라를 시작할 수 없습니다.');
    }
  };

  // 파일 선택 처리
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
    setProcessedImage(null);
    setLabels([]);
    if (stream) {
      startCamera();
    }
  };

  // 이미지 처리 함수
  const handleProcessImage = async () => {
    if (!capturedImage) return;

    setIsProcessing(true);
    setError('');
    
    try {
      const imageFile = base64ToFile(capturedImage);
      const result = await processImage(imageFile);
      
      if (!result || !result.data) {
        throw new Error('이미지 처리 결과가 올바르지 않습니다.');
      }

      const processedImageUrl = URL.createObjectURL(result.data);
      setProcessedImage(processedImageUrl);
      setLabels(result.labels || []);
      setCapturedImage(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '이미지 처리 중 오류가 발생했습니다.');
      console.error('Image processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // 냉장고 목록 가져오기
  const handleGetFridges = async () => {
    try {
      const response = await getAllFridges();
      if (response.success && response.data) {
        setFridges(response.data);
        setShowFridgeSelection(true);
      } else {
        throw new Error('냉장고 목록을 가져오는데 실패했습니다.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '냉장고 목록을 가져오는데 실패했습니다.');
    }
  };

  // 냉장고 선택 처리
  const handleFridgeSelect = (fridgeId: string) => {
    // 여기에 냉장고 선택 후 처리 로직 추가 예정
    console.log('Selected fridge:', fridgeId);
    setShowFridgeSelection(false);
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

          {!stream && !capturedImage && !processedImage && (
            <div className="text-center p-8 border-2 border-dashed border-blue-200 rounded-lg">
              <div className="space-y-4">
                {/* 카메라 촬영 버튼 */}
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300 w-full"
                >
                  <Camera className="w-6 h-6 inline-block mr-2" />
                  카메라로 촬영하기
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

          {stream && !capturedImage && !processedImage && (
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

          {capturedImage && !processedImage && (
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
                  onClick={handleProcessImage}
                  disabled={isProcessing}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300 disabled:bg-blue-300"
                >
                  {isProcessing ? (
                    <>
                      <Loader className="w-5 h-5 inline-block mr-2 animate-spin" />
                      처리중...
                    </>
                  ) : (
                    '사용하기'
                  )}
                </button>
              </div>
            </div>
          )}

          {processedImage && (
            <div className="relative">
              <div className="text-center mb-4">
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg inline-block">
                  음식 분류 완료
                </div>
                {labels && labels.length > 0 && (
                  <div className="mt-2 text-sm text-gray-600">
                    <ul className="list-disc list-inside">
                      {labels.map((label, index) => (
                        <li key={index}>{label}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <img
                src={processedImage}
                alt="처리된 식재료"
                className="w-full rounded-lg"
              />
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => {
                    setProcessedImage(null);
                    setCapturedImage(null);
                    setLabels([]);
                  }}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                >
                  새로운 사진 
                </button>
                <button
                  onClick={handleGetFridges}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-300"
                >
                  냉장고 넣기
                </button>
              </div>
            </div>
          )}

          {/* 냉장고 선택 모달 */}
          {showFridgeSelection && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h3 className="text-xl font-bold mb-4">냉장고 선택</h3>
                <div className="space-y-3">
                  {fridges.map((fridge) => (
                    <button
                      key={fridge._id}
                      onClick={() => handleFridgeSelect(fridge._id)}
                      className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      {fridge.name}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowFridgeSelection(false)}
                  className="mt-4 w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                >
                  취소
                </button>
              </div>
            </div>
          )}

          {/* 로딩 오버레이 */}
          {isProcessing && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <Loader className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
                <p className="text-gray-700">이미지를 처리하고 있습니다...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SnapFoodPage;