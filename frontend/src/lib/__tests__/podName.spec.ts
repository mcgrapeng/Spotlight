import { describe, expect, it } from 'vitest'
import { workloadPrefix } from '../podName'

describe('workloadPrefix', () => {
  it('剥掉 ReplicaSet 生成的哈希后缀 —— 滚动后名字会变，工作负载名不会', () => {
    // 同一个 Pod 被重建后名字从 …-85598c7564-fvq7l 变成 …-566b6cf577-d6zhl。
    // 旧书签 404 时，按前缀找得到新 Pod。
    expect(workloadPrefix('lumen-lumen-service-85598c7564-fvq7l')).toBe('lumen-lumen-service')
    expect(workloadPrefix('agent-api-88764ddf6-cjz5x')).toBe('agent-api')
  })

  it('没有哈希后缀的名字原样返回', () => {
    expect(workloadPrefix('lumen-file-parser-api-6b86d44574-66r6b')).toBe('lumen-file-parser-api')
    expect(workloadPrefix('single')).toBe('single')
    expect(workloadPrefix('')).toBe('')
  })

  it('只有一段像哈希时不剥 —— 别把正常名字段也剥掉', () => {
    expect(workloadPrefix('foo-bar-bazqux')).toBe('foo-bar-bazqux')
  })
})
