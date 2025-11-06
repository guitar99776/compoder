import { CodegenRule } from "@/lib/db/codegen/types"
import { LanguageModel } from "ai"
import { Prompt } from "@/lib/db/componentCode/types"

// 基础的查询类型
type WorkflowQuery = {
  prompt: Prompt[]
  aiModel: LanguageModel
  rules: CodegenRule[]
  userId: string
  codegenId?: string
  component?: {
    id: string
    name: string
    code: string
    prompt: Prompt[]
    isInitialized?: boolean
  }
}

// 工作流状态类型
type WorkflowState = {
  designTask: {
    componentName: string
    componentDescription: string
    // 组件库描述
    library: Array<{
      name: string
      components: string[]
      description: string
    }>
    // 召回的知识
    retrievedAugmentationContent?: string
  }
  generatedCode: string
}

// 初始 Context
export type InitialWorkflowContext = {
  stream: {
    write: (chunk: string) => void
    close: () => void
  }
  query: WorkflowQuery
  // 后续步骤需要挂载上的额外信息
  state?: never
}

// design 处理中的 Context
export type DesignProcessingWorkflowContext = {
  stream: {
    write: (chunk: string) => void
    close: () => void
  }
  query: WorkflowQuery
  state: {
    designTask: {
      componentName: string
      componentDescription: string
      // 组件库描述
      library: Array<{
        name: string
        components: string[]
        description: string
      }>
      // 召回的知识
      retrievedAugmentationContent?: string
    }
  }
}

// generate 处理中的 Context
export type GenerateProcessingWorkflowContext = {
  stream: {
    write: (chunk: string) => void
    close: () => void
  }
  query: WorkflowQuery
  state: {
    designTask: {
      componentName: string
      componentDescription: string
      library: Array<{
        name: string
        components: string[]
        description: string
      }>
      retrievedAugmentationContent?: string
    }
    // 最终生成的代码
    generatedCode: string
  }
}

// 统一的 Context 类型
export type WorkflowContext =
  | InitialWorkflowContext
  | DesignProcessingWorkflowContext
  | GenerateProcessingWorkflowContext
