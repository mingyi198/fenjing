import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface StoryInputFormProps {
    storyIdea: string;
    setStoryIdea: (idea: string) => void;
    onGenerate: () => void;
    isLoading: boolean;
    aspectRatio: '9:16' | '16:9';
    setAspectRatio: (ratio: '9:16' | '16:9') => void;
    style: string;
    setStyle: (style: string) => void;
    composition: string;
    setComposition: (composition: string) => void;
}

const styleOptions = ['写实照片', '美国电影写真', '印度电影写真', '赛博朋克'];
const compositionOptions = ['不指定', '特写', '中景', '全景', '过肩镜头', '鸟瞰视角'];

export const StoryInputForm: React.FC<StoryInputFormProps> = ({ storyIdea, setStoryIdea, onGenerate, isLoading, aspectRatio, setAspectRatio, style, setStyle, composition, setComposition }) => {
    
    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
            onGenerate();
        }
    };

    return (
        <div className="bg-slate-800/50 rounded-lg p-6 shadow-lg border border-slate-700">
            <label htmlFor="story-idea" className="block text-sm font-medium text-slate-300 mb-2">
                输入您的故事构思
            </label>
            <textarea
                id="story-idea"
                rows={4}
                className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 placeholder-slate-500"
                placeholder="例如：一只柯基在晚上发现一辆没开车灯的汽车，并吠叫着阻止主人过马路。"
                value={storyIdea}
                onChange={(e) => setStoryIdea(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
            />

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        画面比例
                    </label>
                    <div className="flex rounded-md bg-slate-900 border border-slate-600 p-1">
                        <button 
                            onClick={() => setAspectRatio('9:16')} 
                            className={`w-1/2 rounded px-3 py-1.5 text-sm font-semibold transition-colors duration-200 ${aspectRatio === '9:16' ? 'bg-violet-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                            disabled={isLoading}
                        >
                            9:16 (竖屏)
                        </button>
                        <button 
                            onClick={() => setAspectRatio('16:9')} 
                            className={`w-1/2 rounded px-3 py-1.5 text-sm font-semibold transition-colors duration-200 ${aspectRatio === '16:9' ? 'bg-violet-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                            disabled={isLoading}
                        >
                            16:9 (横屏)
                        </button>
                    </div>
                </div>
                <div>
                    <label htmlFor="style-select" className="block text-sm font-medium text-slate-300 mb-2">
                        风格
                    </label>
                    <select
                        id="style-select"
                        value={style}
                        onChange={(e) => setStyle(e.target.value)}
                        disabled={isLoading}
                        className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200"
                    >
                        {styleOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>
                 <div>
                    <label htmlFor="composition-select" className="block text-sm font-medium text-slate-300 mb-2">
                        镜头构图
                    </label>
                    <select
                        id="composition-select"
                        value={composition}
                        onChange={(e) => setComposition(e.target.value)}
                        disabled={isLoading}
                        className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200"
                    >
                        {compositionOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mt-6 flex justify-end items-center">
                 <p className="text-xs text-slate-500 mr-4">
                    按 <kbd className="font-sans font-semibold">Cmd/Ctrl</kbd> + <kbd className="font-sans font-semibold">Enter</kbd> 生成
                </p>
                <button
                    onClick={onGenerate}
                    disabled={isLoading}
                    className="flex items-center justify-center w-36 h-12 px-6 font-semibold rounded-md bg-violet-600 text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-violet-500 transition-colors duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
                >
                    {isLoading ? <LoadingSpinner /> : '生成'}
                </button>
            </div>
        </div>
    );
};