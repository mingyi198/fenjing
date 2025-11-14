import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { StoryInputForm } from './components/StoryInputForm';
import { StoryboardDisplay } from './components/StoryboardDisplay';
import { ErrorMessage } from './components/ErrorMessage';
import { WelcomeMessage } from './components/WelcomeMessage';
import { generateStoryboardScript, generateStoryBranch } from './services/geminiService';
import type { Storyboard, Panel } from './types';

const App: React.FC = () => {
    const [storyIdea, setStoryIdea] = useState<string>('');
    const [storyboard, setStoryboard] = useState<Storyboard | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('16:9');
    const [style, setStyle] = useState<string>('写实照片');
    const [composition, setComposition] = useState<string>('不指定');
    
    const [storyboardBranches, setStoryboardBranches] = useState<Record<number, Storyboard>>({});
    const [isBranching, setIsBranching] = useState<number | null>(null);
    const [branchError, setBranchError] = useState<string | null>(null);


    const handleGenerate = useCallback(async () => {
        if (!storyIdea.trim()) {
            setError("请输入您的故事构思。");
            return;
        }
        setIsLoading(true);
        setError(null);
        setBranchError(null);
        setStoryboard(null);
        setStoryboardBranches({});


        try {
            const result = await generateStoryboardScript(storyIdea, aspectRatio, style, composition);
            setStoryboard(result);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("发生了未知错误。");
            }
        } finally {
            setIsLoading(false);
        }
    }, [storyIdea, aspectRatio, style, composition]);

    const handleGenerateBranch = useCallback(async (panelIndex: number, branchIdea: string) => {
        if (!storyboard || !branchIdea.trim()) {
            setBranchError("无法创建分支：缺少主脚本或新的故事构思。");
            return;
        }

        setIsBranching(panelIndex);
        setBranchError(null);
        setError(null);

        try {
            const contextPanels = storyboard.slice(0, panelIndex + 1);
            const newBranch = await generateStoryBranch(contextPanels, branchIdea);

            setStoryboardBranches(prevBranches => ({
                ...prevBranches,
                [panelIndex]: newBranch
            }));

        } catch (e) {
            if (e instanceof Error) {
                setBranchError(e.message);
            } else {
                setBranchError("创建故事分支时发生未知错误。");
            }
        } finally {
            setIsBranching(null);
        }
    }, [storyboard]);

    return (
        <div className="min-h-screen bg-slate-900 font-sans text-slate-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-4xl mx-auto">
                <Header />
                <main className="mt-8">
                    <StoryInputForm
                        storyIdea={storyIdea}
                        setStoryIdea={setStoryIdea}
                        onGenerate={handleGenerate}
                        isLoading={isLoading}
                        aspectRatio={aspectRatio}
                        setAspectRatio={setAspectRatio}
                        style={style}
                        setStyle={setStyle}
                        composition={composition}
                        setComposition={setComposition}
                    />
                    {error && <ErrorMessage message={error} />}
                    
                    <div className="mt-12">
                        {!isLoading && !storyboard && !error && <WelcomeMessage />}
                        {storyboard && (
                            <StoryboardDisplay 
                                storyboard={storyboard} 
                                aspectRatio={aspectRatio} 
                                style={style} 
                                composition={composition}
                                onGenerateBranch={handleGenerateBranch}
                                storyboardBranches={storyboardBranches}
                                isBranching={isBranching}
                                branchError={branchError}
                            />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;