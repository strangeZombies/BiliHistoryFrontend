<template>
  <div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- 标题和总结部分 -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold bg-gradient-to-r from-[#fb7299] to-[#fc9b7a] bg-clip-text text-transparent">
          标题关键词分析
        </h2>
        <div class="mt-4 text-gray-600 max-w-3xl mx-auto">
          <p class="mb-2">{{ titleAnalytics.insights[0] }}</p>
          <p class="mb-2">{{ titleAnalytics.insights[1] }}</p>
          <p>{{ titleAnalytics.insights[2] }}</p>
        </div>
      </div>

      <!-- 主要内容区域 - 使用网格布局 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 左侧：词云图 -->
        <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">
          <h3 class="text-xl font-semibold text-gray-600 mb-4">热门关键词</h3>
          <div ref="wordCloudRef" class="w-full h-[300px]"></div>
        </div>

        <!-- 右侧：完成率对比图表 -->
        <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">
          <h3 class="text-xl font-semibold text-gray-600 mb-4">关键词完成率对比</h3>
          <div ref="completionChartRef" class="w-full h-[300px]"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, onUnmounted } from 'vue'
import * as echarts from 'echarts/core'

const props = defineProps({
  titleAnalytics: {
    type: Object,
    required: true
  }
})

const wordCloudRef = ref(null)
const completionChartRef = ref(null)
let wordCloudChart = null
let completionChart = null

// 处理完成率数据
computed(() => {
  const rates = Object.entries(props.titleAnalytics.keyword_analysis.completion_rates)
    .sort(([, a], [, b]) => b.average_completion_rate - a.average_completion_rate)
    .slice(0, 5)
  return Object.fromEntries(rates)
})
computed(() => {
  const rates = Object.entries(props.titleAnalytics.keyword_analysis.completion_rates)
    .sort(([, a], [, b]) => a.average_completion_rate - b.average_completion_rate)
    .slice(0, 5)
  return Object.fromEntries(rates)
})
// 初始化词云图
const initWordCloud = () => {
  if (!wordCloudRef.value) return

  wordCloudChart = echarts.init(wordCloudRef.value)
  const wordCloudData = props.titleAnalytics.keyword_analysis.top_keywords.map(item => ({
    name: item.word,
    value: item.count,
    textStyle: {
      color: `rgb(${Math.random() * 70 + 185}, ${Math.random() * 70 + 185}, ${Math.random() * 70 + 185})`
    }
  }))

  const option = {
    tooltip: {
      show: true,
      formatter: function(params) {
        return `${params.name}: ${params.value}次`
      },
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderColor: 'rgba(251, 114, 153, 0.7)',
      borderWidth: 1,
      padding: [5, 10],
      textStyle: {
        color: '#e1e1e1',
        fontSize: 12
      }
    },
    series: [{
      type: 'wordCloud',
      shape: 'circle',
      left: 'center',
      top: 'center',
      width: '90%',
      height: '90%',
      right: null,
      bottom: null,
      sizeRange: [12, 60],
      rotationRange: [-45, 45],
      rotationStep: 45,
      gridSize: 8,
      drawOutOfBound: false,
      layoutAnimation: true,
      textStyle: {
        fontFamily: 'sans-serif',
        fontWeight: 'bold'
      },
      emphasis: {
        focus: 'self',
        textStyle: {
          shadowBlur: 10,
          shadowColor: '#333'
        }
      },
      data: wordCloudData
    }]
  }

  wordCloudChart.setOption(option)
}

// 初始化完成率对比图表
const initCompletionChart = () => {
  if (!completionChartRef.value) return

  completionChart = echarts.init(completionChartRef.value)

  // 合并所有数据并按完成率排序
  const allData = Object.entries(props.titleAnalytics.keyword_analysis.completion_rates)
    .map(([word, data]) => ({
      word,
      rate: (data.average_completion_rate * 100).toFixed(1)
    }))
    .sort((a, b) => Number(b.rate) - Number(a.rate))
    .slice(0, 10)

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params) {
        return `${params[0].name}: ${params[0].value}%`
      }
    },
    grid: {
      top: '10%',
      left: '15%',
      right: '5%',
      bottom: '15%'
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        color: '#4B5563',
        formatter: '{value}%'
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    },
    yAxis: {
      type: 'category',
      data: allData.map(item => item.word).reverse(),
      axisLabel: {
        color: '#4B5563'
      }
    },
    series: [
      {
        name: '完成率',
        type: 'bar',
        data: allData.map(item => item.rate).reverse(),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#fb7299' },
            { offset: 1, color: '#fc9b7a' }
          ])
        },
        label: {
          show: true,
          position: 'right',
          color: '#4B5563',
          formatter: '{c}%'
        }
      }
    ]
  }

  completionChart.setOption(option)
}

// 监听窗口大小变化
const handleResize = () => {
  if (wordCloudChart) {
    wordCloudChart.resize()
  }
  if (completionChart) {
    completionChart.resize()
  }
}

onMounted(() => {
  initWordCloud()
  initCompletionChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (wordCloudChart) {
    wordCloudChart.dispose()
  }
  if (completionChart) {
    completionChart.dispose()
  }
})

// 监听数据变化
watch(() => props.titleAnalytics, () => {
  if (wordCloudChart) {
    initWordCloud()
  }
  if (completionChart) {
    initCompletionChart()
  }
}, { deep: true })
</script>
