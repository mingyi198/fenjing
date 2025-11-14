import React, { useState } from 'react';
import type { Storyboard, Panel } from '../types';
import { StoryBranchForm } from './StoryBranchForm';
import { ErrorMessage } from './ErrorMessage';


interface StoryboardDisplayProps {
    storyboard: Storyboard;
    aspectRatio: string;
    style: string;
    composition: string;
    onGenerateBranch: (panelIndex: number, branchIdea: string, emotion: string) => Promise<void>;
    storyboardBranches: Record<number, Storyboard>;
    isBranching: number | null;
    branchError: string | null;
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

const PanelDisplay: React.FC<{ panel: Panel }> = ({ panel }) => (
    <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
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
    </>
);


export const StoryboardDisplay: React.FC<StoryboardDisplayProps> = ({ 
    storyboard, 
    aspectRatio, 
    style, 
    composition, 
    onGenerateBranch,
    storyboardBranches,
    isBranching,
    branchError 
}) => {
    const [activeBranchForm, setActiveBranchForm] = useState<number | null>(null);

    const handleToggleBranchForm = (panelNumber: number) => {
        setActiveBranchForm(active => active === panelNumber ? null : panelNumber);
    }

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
            {storyboard.map((panel, index) => (
                <div key={panel.panel}>
                    <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 shadow-md transition-all duration-300">
                        <div className="flex justify-between items-start mb-4 gap-2">
                            <h3 className="text-xl font-bold text-violet-400">分镜 {panel.panel}</h3>
                            <div className="flex gap-2 flex-wrap justify-end">
                                <button 
                                   onClick={() => handleToggleBranchForm(panel.panel)}
                                   disabled={isBranching !== null}
                                   className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 bg-slate-700/50 hover:bg-slate-700 px-3 py-1 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                   添加故事情节分支
                                </button>
                            </div>
                        </div>

                        {activeBranchForm === panel.panel && (
                            <StoryBranchForm
                                panelIndex={index}
                                onGenerate={async (idx, branchIdea, emotion) => {
                                    await onGenerateBranch(idx, branchIdea, emotion);
                                    setActiveBranchForm(null);
                                }}
                                isLoading={isBranching === index}
                                onCancel={() => setActiveBranchForm(null)}
                            />
                        )}

                        {branchError && isBranching === index && <ErrorMessage message={branchError} />}
                        
                        <PanelDisplay panel={panel} />
                    </div>

                    {storyboardBranches[index] && (
                        <div className="mt-4 ml-4 md:ml-8 pl-4 md:pl-6 border-l-2 border-cyan-500 space-y-4">
                             <h4 className="text-lg font-bold text-cyan-400 mt-4">故事分支 (从分镜 {panel.panel} 开始)</h4>
                            {storyboardBranches[index].map(branchPanel => (
                                 <div key={`branch-${panel.panel}-${branchPanel.panel}`} className="bg-slate-800/30 rounded-lg p-6 border border-slate-700/50 shadow-sm">
                                     <h3 className="text-xl font-bold text-cyan-400 mb-4">分镜 {branchPanel.panel}</h3>
                                     <PanelDisplay panel={branchPanel} />
                                 </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};