import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { StoryInputForm } from './components/StoryInputForm';
import { StoryboardDisplay } from './components/StoryboardDisplay';
import { ErrorMessage } from './components/ErrorMessage';
import { WelcomeMessage } from './components/WelcomeMessage';
import { generateStoryboardScript } from './services/geminiService';
import type { Storyboard } from './types';

const App: React.FC = () => {
    const [storyIdea, setStoryIdea] = useState<string>('');
    const [storyboard, setStoryboard] = useState<Storyboard | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('16:9');
    const [style, setStyle] = useState<string>('写实照片');

    const handleGenerate = useCallback(async () => {
        if (!storyIdea.trim()) {
            setError("请输入您的故事构思。");
            return;
        }
        setIsLoading(true);
        setError(null);
        setStoryboard(null);

        try {
            const result = await generateStoryboardScript(storyIdea, aspectRatio, style);
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
    }, [storyIdea, aspectRatio, style]);

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
                    />
                    {error && <ErrorMessage message={error} />}
                    
                    <div className="mt-12">
                        {!isLoading && !storyboard && !error && <WelcomeMessage />}
                        {storyboard && <StoryboardDisplay storyboard={storyboard} aspectRatio={aspectRatio} style={style} />}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;