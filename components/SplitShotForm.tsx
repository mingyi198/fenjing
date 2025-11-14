import React, { useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface SplitShotFormProps {
    panelIndex: number;
    onGenerate: (panelIndex: number, instruction: string) => Promise<void>;
    isLoading: boolean;
    onCancel: () => void;
}

export const SplitShotForm: React.FC<SplitShotFormProps> = ({ panelIndex, onGenerate, isLoading, onCancel }) => {
    const [instruction, setInstruction] = useState('');

    const handleSubmit = () => {
        if (instruction.trim() && !isLoading) {
            onGenerate(panelIndex, instruction);
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
            <label htmlFor={`split-shot-${panelIndex}`} className="block text-sm font-medium text-slate-300 mb-2">
                添加新镜头描述
            </label>
            <textarea
                id={`split-shot-${panelIndex}`}
                rows={2}
                className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 text-slate-200 focus:ring-2 focus:ring-cyan-500 transition-colors placeholder-slate-500"
                placeholder="例如：给狗狗一个特写，眼神充满警惕。"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                autoFocus
            />
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
                    disabled={isLoading || !instruction.trim()}
                    className="flex items-center justify-center w-36 h-10 px-4 text-sm font-semibold rounded-md bg-cyan-600 text-white hover:bg-cyan-700 transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed"
                >
                    {isLoading ? <LoadingSpinner /> : '生成新分镜'}
                </button>
            </div>
        </div>
    );
};