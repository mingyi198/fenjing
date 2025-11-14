import { GoogleGenAI, Type } from "@google/genai";
import type { Storyboard, Panel } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStoryboardScript = async (storyIdea: string, aspectRatio: string, style: string, composition: string): Promise<Storyboard> => {
    const model = 'gemini-2.5-flash';
    const fullPrompt = `用户想要一个关于狗狗提醒主人注意来自人或车辆危险的分镜脚本。

    请遵循以下规范：
    - 视觉风格: ${style}
    - 画面比例: ${aspectRatio}
    - 镜头构图偏好: ${composition === '不指定' ? '无特殊偏好，请根据故事节奏自由选择最佳镜头。' : `请在脚本中优先或频繁使用“${composition}”风格的镜头构图，以突出特定氛围。`}

    具体的故事情节如下：“${storyIdea}”

    ## 一致性保障系统 (CRITICAL)
    在生成任何分镜之前，请先在内部构思并锁定以下核心视觉元素。在后续所有分镜的描述和提示词中，必须严格、重复地使用这些确切的描述，以保证场景、主体、样貌和颜色的绝对一致性。
    - **核心主体**: [定义主角狗狗和主人的具体样貌、穿着、颜色。例如：一只名叫“闪电”的奶油色柯基犬，蓝色眼睛，戴着红色皮质项圈。一位名叫“小雅”的年轻女性，齐肩黑直发，戴着银色圆形眼镜，穿着米色风衣和蓝色牛仔裤。]
    - **核心场景**: [定义故事发生的主要环境。例如：傍晚时分的城市街角，人行道旁有一家亮着暖黄灯光的咖啡店，地面有雨后留下的些许积水，反射着霓虹灯光。]

    ## 生成规则
    ### 故事脚本结构
    请严格按照以下四幕结构来组织故事：
    1.  **危险引入**: 铺垫潜在的危险，主角和狗狗尚未察觉。
    2.  **狗狗发现**: 狗狗首先敏锐地发现了危险。
    3.  **救援行动**: 狗狗通过行动（吠叫、拉拽等）成功提醒或阻止了主人。
    4.  **温馨结局**: 危险解除，主人感激地与狗狗互动，故事圆满结束。

    ### 逻辑检查
    每个镜头必须能够无缝衔接前后的画面，形成连贯的视觉叙事。例如：如果镜头1中一个物体出现在画面的右侧，镜头2中角色的视线就应该朝向右侧。

    ## 输出内容
    请基于以上想法和规则，生成一个简洁的分镜脚本。在描述场景和镜头时，请充分体现所选的风格和画面比例。

    **重要**: 为每个镜头生成以下内容。**所有内容，包括提示词，都必须使用中文**：
    1.  **分镜描述** (场景, 镜头, 动作, 对话)。场景描述必须与上方定义的“核心场景”保持一致。
    2.  **文生图提示词 (imagePrompt)**: 用于生成此分镜静态关键帧的**中文**提示词。此提示词必须明确包含在“一致性保障系统”中定义的“核心主体”和“核心场景”的**完整描述**，以确保视觉的绝对统一。
    3.  **图生视频提示词 (videoPrompt)**: 基于关键帧的动作描述，说明该镜头中的动态变化。**此提示词也必须是中文**，并引用“核心主体”和“核心场景”的描述。`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            panel: { 
                                type: Type.INTEGER, 
                                description: "分镜编号，从1开始。" 
                            },
                            scene: { 
                                type: Type.STRING, 
                                description: "对视觉环境、时间、在场人物的描述。必须与'核心场景'定义保持一致。" 
                            },
                            camera: { 
                                type: Type.STRING, 
                                description: "对镜头、角度、移动的描述。例如：'中景'，'狗眼特写'。应体现出所选的画面比例和镜头构图偏好。"
                            },
                            action: { 
                                type: Type.STRING, 
                                description: "对该分镜中发生的动作的描述。" 
                            },
                            dialogue: { 
                                type: Type.STRING, 
                                description: "角色的任何对话。如果没有则使用空字符串。" 
                            },
                            imagePrompt: {
                                type: Type.STRING,
                                description: "用于生成此分镜静态关键帧的中文文生图提示词。必须明确包含在“一致性保障系统”中定义的“核心主体”和“核心场景”的完整描述，以确保视觉的绝对统一。"
                            },
                            videoPrompt: {
                                type: Type.STRING,
                                description: "基于关键帧的中文图生视频提示词，描述了此分镜中的动作。必须引用“核心主体”和“核心场景”的描述。"
                            }
                        },
                        required: ["panel", "scene", "camera", "action", "dialogue", "imagePrompt", "videoPrompt"],
                    },
                },
            },
        });
        
        const jsonText = response.text.trim();
        const parsedStoryboard: Storyboard = JSON.parse(jsonText);
        return parsedStoryboard;
    } catch (e) {
        console.error("Error generating or parsing storyboard:", e);
        if (e instanceof Error) {
            throw new Error(`生成分镜失败。Gemini API 错误：${e.message}`);
        }
        throw new Error("生成分镜时发生未知错误。");
    }
};

export const generateStoryBranch = async (
    contextPanels: Storyboard,
    branchIdea: string,
    emotion: string
): Promise<Storyboard> => {
    const model = 'gemini-2.5-flash';
    const contextString = JSON.stringify(contextPanels, null, 2);

    const emotionInstruction = emotion === '不指定' 
        ? '' 
        : `2. **核心情感基调**: 这个故事分支必须强烈地围绕“${emotion}”这个情绪展开。请在角色的动作、面部表情、对话（如果有）以及镜头的运用中，都突出和放大这种情绪，创造出极具戏剧张力的情节。`;

    const fullPrompt = `你是一位专业的电影分镜师。一个故事正在进行中，现在需要从一个特定的点开始创作一个全新的“故事分支”。

    这是主线故事的上下文，直到分支点（分镜 ${contextPanels.length}）：
    \`\`\`json
    ${contextString}
    \`\`\`

    现在，用户想要从这个点开始，探索一个全新的故事走向。新的故事构思是：“${branchIdea}”

    **至关重要的规则**:
    1.  **视觉一致性 (ABSOLUTE HIGHEST PRIORITY)**: 新生成的所有分镜，必须在视觉上（场景、角色样貌、颜色、风格等）与上面提供的上下文保持绝对一致。请仔细分析上下文中的 "scene" 和 "imagePrompt" 来推断并锁定核心视觉元素（核心主体和核心场景），并在所有新分镜的描述和提示词中严格、完整地复用它们。
    ${emotionInstruction}
    ${emotion === '不指定' ? '2.' : '3.'}  **故事延续性**: 新分支的第一个镜头应该自然地从分镜 ${contextPanels.length} 的结尾开始，然后根据新的故事构思“${branchIdea}”展开。
    ${emotion === '不指定' ? '3.' : '4.'}  **重新编号**: 新分支的分镜编号应从 ${contextPanels.length + 1} 开始，并依次递增。
    ${emotion === '不指定' ? '4.' : '5.'}  **完整结构**: 请为这个新的分支生成一个包含多幕（例如，2-4个镜头）的完整小故事，使其有自己的发展和结局。
    ${emotion === '不指定' ? '5.' : '6.'}  **输出格式**: 你必须只返回一个JSON数组，代表这个新的故事分支的所有分镜。不要返回任何其他文字或解释。

    请根据新的故事构思，生成这个全新的、视觉一致的故事分支。`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            panel: { type: Type.INTEGER, description: "分镜编号。" },
                            scene: { type: Type.STRING, description: "场景描述，必须与上下文保持一致。" },
                            camera: { type: Type.STRING, description: "镜头描述。" },
                            action: { type: Type.STRING, description: "动作描述。" },
                            dialogue: { type: Type.STRING, description: "对话，没有则为空字符串。" },
                            imagePrompt: { type: Type.STRING, description: "中文文生图提示词，必须与上下文视觉风格保持一致。" },
                            videoPrompt: { type: Type.STRING, description: "中文图生视频提示词，必须与上下文视觉风格保持一致。" }
                        },
                        required: ["panel", "scene", "camera", "action", "dialogue", "imagePrompt", "videoPrompt"],
                    },
                },
            },
        });

        const jsonText = response.text.trim();
        const newBranch: Storyboard = JSON.parse(jsonText);
        return newBranch;
    } catch (e) {
        console.error("Error generating story branch:", e);
        if (e instanceof Error) {
            throw new Error(`生成故事分支失败。Gemini API 错误：${e.message}`);
        }
        throw new Error("生成故事分支时发生未知错误。");
    }
};