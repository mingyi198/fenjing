import React, { useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

const emotionOptions = ['不指定', '夸张害怕', '夸张担心', '夸张惊吓', '夸张嘲笑', '夸张怒视', '夸张畏缩', '夸张发抖', '夸张开心', '夸张流泪', '夸张委屈'];

interface StoryBranchFormProps {
    panelIndex: number;
    onGenerate: (panelIndex: number, branchIdea: string, emotion: string) => Promise<void>;
    isLoading: boolean;
    onCancel: () => void;
}

export const StoryBranchForm: React.FC<StoryBranchFormProps> = ({ panelIndex, onGenerate, isLoading, onCancel }) => {
    const [branchIdea, setBranchIdea] = useState('');
    const [emotion, setEmotion] = useState(emotionOptions[0]);

    const handleSubmit = () => {
        if (branchIdea.trim() && !isLoading) {
            onGenerate(panelIndex, branchIdea, emotion);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
            event.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="mb-4 border-b border-slate-700 pb-4 animate-fade-in">
            <label htmlFor={`branch-idea-${panelIndex}`} className="block text-sm font-medium text-slate-300 mb-2">
                输入新的故事走向
            </label>
            <textarea
                id={`branch-idea-${panelIndex}`}
                rows={3}
                className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 text-slate-200 focus:ring-2 focus:ring-cyan-500 transition-colors placeholder-slate-500"
                placeholder="例如：主人没有注意到狗狗，继续向前走，结果……"
                value={branchIdea}
                onChange={(e) => setBranchIdea(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                autoFocus
            />
            
            <div className="mt-4">
                <label htmlFor={`emotion-select-${panelIndex}`} className="block text-sm font-medium text-slate-300 mb-2">
                    人物面部情绪
                </label>
                <select
                    id={`emotion-select-${panelIndex}`}
                    value={emotion}
                    onChange={(e) => setEmotion(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200"
                >
                    {emotionOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            </div>

            <div className="mt-3 flex justify-end gap-3">
                <button
                    onClick={onCancel}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-semibold rounded-md bg-slate-600 hover:bg-slate-500 text-white transition-colors"
                >
                    取消
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !branchIdea.trim()}
                    className="flex items-center justify-center w-32 h-10 px-4 text-sm font-semibold rounded-md bg-cyan-600 text-white hover:bg-cyan-700 transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed"
                >
                    {isLoading ? <LoadingSpinner /> : '生成分支'}
                </button>
            </div>
        </div>
    );
};