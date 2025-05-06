'use client';

import { create } from 'zustand';

type Language = 'en' | 'ko';

interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

const translations: Translations = {
  appTitle: {
    en: 'Icon Package Generator',
    ko: '아이콘 패키지 생성기',
  },
  appDescription: {
    en: 'Generate a complete set of icons and manifest.json for your web app',
    ko: '웹 앱을 위한 아이콘 세트와 manifest.json을 생성하세요',
  },
  dropzone: {
    en: 'Drag and drop your 1024x1024 PNG here',
    ko: '1024x1024 PNG 파일을 여기에 드래그하세요',
  },
  dropzoneActive: {
    en: 'Drop your file here',
    ko: '여기에 파일을 놓으세요',
  },
  orClick: {
    en: 'or click to select a file',
    ko: '또는 클릭하여 파일 선택',
  },
  fileRequirements: {
    en: 'File requirements:',
    ko: '파일 요구사항:',
  },
  pngOnly: {
    en: 'PNG format only',
    ko: 'PNG 형식만 지원',
  },
  dimensions: {
    en: '1024x1024 pixels',
    ko: '1024x1024 픽셀',
  },
  maxSize: {
    en: 'Maximum 5MB',
    ko: '최대 5MB',
  },
  generating: {
    en: 'Generating icons...',
    ko: '아이콘 생성 중...',
  },
  finalizing: {
    en: 'Finalizing package...',
    ko: '패키지 완성 중...',
  },
  success: {
    en: 'Icons generated successfully! 🎉',
    ko: '아이콘이 성공적으로 생성되었습니다! 🎉',
  },
  error: {
    en: 'Failed to generate icons. Please try again.',
    ko: '아이콘 생성에 실패했습니다. 다시 시도해주세요.',
  },
  fileTooLarge: {
    en: 'File size must be less than 5MB',
    ko: '파일 크기는 5MB 미만이어야 합니다',
  },
  invalidFormat: {
    en: 'Only PNG files are supported',
    ko: 'PNG 파일만 지원됩니다',
  },
  invalidDimensions: {
    en: 'Image must be 1024x1024 pixels',
    ko: '이미지는 1024x1024 픽셀이어야 합니다',
  },
  manifestSettings: {
    en: 'Manifest Settings',
    ko: '매니페스트 설정',
  },
  appName: {
    en: 'App Name',
    ko: '앱 이름',
  },
  shortName: {
    en: 'Short Name',
    ko: '짧은 이름',
  },
  themeColor: {
    en: 'Theme Color',
    ko: '테마 색상',
  },
  backgroundColor: {
    en: 'Background Color',
    ko: '배경 색상',
  },
  preview: {
    en: 'Preview',
    ko: '미리보기',
  },
  previewSize: {
    en: 'Preview Size',
    ko: '미리보기 크기',
  },
  fileInput: {
    en: 'Select PNG file',
    ko: 'PNG 파일 선택',
  },
  previewImage: {
    en: 'Preview of uploaded image',
    ko: '업로드된 이미지 미리보기',
  },
  currentSize: {
    en: 'Current size: {size}x{size} pixels',
    ko: '현재 크기: {size}x{size} 픽셀',
  },
  previewSizeControls: {
    en: 'Preview size controls',
    ko: '미리보기 크기 조절',
  },
  decreaseSize: {
    en: 'Decrease preview size',
    ko: '미리보기 크기 줄이기',
  },
  increaseSize: {
    en: 'Increase preview size',
    ko: '미리보기 크기 늘리기',
  },
  iconSizeSettings: {
    en: 'Icon Size Settings',
    ko: '아이콘 크기 설정',
  },
  iconSizes: {
    en: 'Icon Sizes',
    ko: '아이콘 크기',
  },
  enterCustomSize: {
    en: 'Enter size',
    ko: '크기 입력',
  },
  customSizeInput: {
    en: 'Custom size input',
    ko: '사용자 정의 크기 입력',
  },
  addCustomSize: {
    en: 'Add custom size',
    ko: '사용자 정의 크기 추가',
  },
  add: {
    en: 'Add',
    ko: '추가',
  },
  sizeRange: {
    en: 'Size must be between {min} and {max} pixels',
    ko: '크기는 {min}에서 {max} 픽셀 사이여야 합니다',
  },
  atLeastOneSize: {
    en: 'At least one size must be selected',
    ko: '최소 하나의 크기를 선택해야 합니다',
  },
  invalidCustomSize: {
    en: 'Invalid size. Must be between {min} and {max} pixels',
    ko: '잘못된 크기입니다. {min}에서 {max} 픽셀 사이여야 합니다',
  },
  sizeAlreadyExists: {
    en: 'This size already exists',
    ko: '이미 존재하는 크기입니다',
  },
  removeSize: {
    en: 'Remove {size}x{size} size',
    ko: '{size}x{size} 크기 제거',
  },
  switchLanguage: {
    en: 'Switch to Korean',
    ko: '영어로 전환',
  },
  language: {
    en: 'Language',
    ko: '언어',
  },
};

interface LanguageStore {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
}

type SetState = {
  setState: (partial: Partial<LanguageStore> | ((state: LanguageStore) => Partial<LanguageStore>)) => void;
};

const useLanguageStore = create<LanguageStore>((set: SetState['setState']) => ({
  currentLanguage: (() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('preferredLanguage') as Language;
      return savedLanguage || 'en';
    }
    return 'en';
  })(),
  setLanguage: (lang: Language) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredLanguage', lang);
    }
    set({ currentLanguage: lang });
  },
}));

export function t(key: keyof typeof translations, params?: Record<string, string | number>): string {
  const currentLanguage = useLanguageStore.getState().currentLanguage;
  let translation = translations[key]?.[currentLanguage] || translations[key]?.en || String(key);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      translation = translation.replace(`{${key}}`, String(value));
    });
  }
  
  return translation;
}

export function useTranslation() {
  const { currentLanguage, setLanguage } = useLanguageStore();
  return { currentLanguage, setLanguage, t };
} 