
import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-500 pb-2">
                AI 分镜生成器
            </h1>
            <p className="text-slate-400 mt-2 text-lg">
                为勇敢的狗狗故事而生。
            </p>
        </header>
    );
};