/**
 * Pod 名里的哈希后缀。
 *
 * ReplicaSet/StatefulSet 起的 Pod 名带两段哈希（lumen-lumen-service-85598c7564-fvq7l
 * → 部署名 + rs 哈希 + pod 哈希）。工作负载被重建，名字里的哈希就变了：
 * lumen-lumen-service-566b6cf577-d6zhl 是同一个服务。
 */

/** 一段像哈希的尾巴：5–10 位小写字母数字（rs 哈希 10 位、pod 哈希 5 位）。 */
const HASH_SEGMENT = /^[a-z0-9]{5,10}$/

/**
 * 剥掉两段连续像哈希的尾巴，得到「工作负载名」。
 *
 * 旧书签 404 时，读者要找的是「这个东西」，不是那个已经消失的名字 ——
 * 按前缀找得到重建后的那个 Pod。
 *
 * 只剥两段（rs 起名带两段），免得把正常的名字段也剥掉：只有一段像哈希
 * 时原样返回。
 */
export function workloadPrefix(name: string): string {
  const parts = name.split('-')
  if (parts.length < 3) return name
  let end = parts.length
  let stripped = 0
  while (end > 1 && stripped < 2 && HASH_SEGMENT.test(parts[end - 1])) {
    end -= 1
    stripped += 1
  }
  return stripped === 2 ? parts.slice(0, end).join('-') : name
}
