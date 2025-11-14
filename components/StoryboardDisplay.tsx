import React from 'react';
import type { Storyboard } from '../types';

interface StoryboardDisplayProps {
    storyboard: Storyboard;
    aspectRatio: string;
    style: string;
    composition: string;
}

const DetailRow: React.FC<{ label: string; content: string }> = ({ label, content }) => (
    <div className="mt-3">
        <h4 className="text-xs font-semibold uppercase text-cyan-400 tracking-wider">{label}</h4>
        <p className="text-slate-300 mt-1">{content}</p>
    </div>
);

const PromptRow: React.FC<{ label: string; content: string }> = ({ label, content }) => (
    <div className="mt-3">
        <h4 className="text-xs font-semibold uppercase text-cyan-400 tracking-wider">{label}</h4>
        <pre className="text-slate-300 mt-2 bg-slate-900 p-3 rounded-md text-sm whitespace-pre-wrap font-sans"><code>{content}</code></pre>
    </div>
);


export const StoryboardDisplay: React.FC<StoryboardDisplayProps> = ({ storyboard, aspectRatio, style, composition }) => {
    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-100">您的分镜脚本</h2>
                <p className="text-slate-400 mt-2 text-sm md:text-base">
                    风格: <span className="font-semibold text-slate-300">{style}</span> | 
                    画面比例: <span className="font-semibold text-slate-300">{aspectRatio}</span> |
                    镜头构图: <span className="font-semibold text-slate-300">{composition}</span>
                </p>
            </div>
            {storyboard.map((panel) => (
                <div key={panel.panel} className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 shadow-md transform hover:scale-[1.02] hover:border-violet-500 transition-all duration-300">
                    <h3 className="text-xl font-bold text-violet-400">分镜 {panel.panel}</h3>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <DetailRow label="场景" content={panel.scene} />
                        <DetailRow label="镜头" content={panel.camera} />
                        <div className="md:col-span-2">
                           <DetailRow label="动作" content={panel.action} />
                        </div>
                         {panel.dialogue && (
                            <div className="md:col-span-2">
                                <DetailRow label="对话" content={`"${panel.dialogue}"`} />
                            </div>
                        )}
                        <div className="md:col-span-2 border-t border-slate-700 my-2"></div>
                        <div className="md:col-span-2">
                            <PromptRow label="文生图提示词" content={panel.imagePrompt} />
                        </div>
                         <div className="md:col-span-2">
                            <PromptRow label="图生视频提示词" content={panel.videoPrompt} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};