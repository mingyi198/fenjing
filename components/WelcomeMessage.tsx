import React from 'react';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-slate-800/40 p-6 rounded-lg border border-slate-700">
        <div className="flex items-center">
            <div className="text-cyan-400">{icon}</div>
            <h3 className="ml-4 text-lg font-semibold text-slate-100">{title}</h3>
        </div>
        <p className="mt-2 text-slate-400 text-sm">{description}</p>
    </div>
);

export const WelcomeMessage: React.FC = () => {
    return (
        <div className="text-center p-6 bg-slate-800/20 rounded-lg border border-dashed border-slate-700">
            <h2 className="text-2xl font-bold text-slate-200">准备好将您的故事可视化了吗？</h2>
            <p className="mt-2 text-slate-400 max-w-2xl mx-auto">
                只需在上方输入您的故事概念，我们的人工智能助手就会为您制作专业的分镜脚本。
            </p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <FeatureCard 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
                    title="专注于危险场景"
                    description="AI 经过专门训练，可以生成狗狗英勇地提醒主人注意来自人或车辆危险的脚本。"
                />
                <FeatureCard 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
                    title="影视化结构与视觉一致性"
                    description="脚本遵循经典的四幕结构并确保镜头间的逻辑连贯。更重要的是，内置的视觉一致性系统能确保角色和场景在所有分镜中保持统一的外观、颜色和风格。"
                />
            </div>
        </div>
    );
};