<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Compass } from '@lucide/vue'
import PageHeader from '@/components/common/PageHeader.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const router = useRouter()
const { t } = useI18n()

function goHome() {
  router.push({ name: 'dashboard' })
}
</script>

<template>
  <div class="space-y-5">
    <PageHeader :title="t('notFound.title')" />

    <Card class="p-0">
      <EmptyState :title="t('notFound.description')">
        <template #icon>
          <Compass :size="40" class="text-muted-foreground" :stroke-width="1.5" />
        </template>
        <template #action>
          <Button @click="goHome">
            {{ t('notFound.backHome') }}
          </Button>
        </template>
      </EmptyState>
    </Card>
  </div>
</template>
