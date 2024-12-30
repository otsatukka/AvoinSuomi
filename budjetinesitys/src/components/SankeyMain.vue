<template>
    <div>
      <svg :width="width" :height="height" v-if="data">
        <g>
          <defs>
            <SankeyGradient
              :colors="colors"
              :data="link"
              :length="length"
              :key="`${link.source.name}-${link.target.name}`"
              v-for="link in links"
            ></SankeyGradient>
          </defs>
          <SankeyLink
            :data="link"
            :colors="colors"
            :length="length"
            :key="`${link.source.name}-${link.target.name}`"
            v-for="link in links"
          ></SankeyLink>
        </g>
        <g>
          <SankeyNode
            :data="node"
            :colors="colors"
            :length="length"
            :width="width"
            :key="node.name"
            v-for="node in nodes"
          ></SankeyNode>
          <NodeTitle
            :data="node"
            :colors="colors"
            :length="length"
            :width="width"
            :key="node.name + node.index"
            v-for="node in nodes"
          ></NodeTitle>
        </g>
      </svg>
    </div>
  </template>
  
  <script>
  import * as d3 from "d3";
  import { sankey, sankeyJustify } from "d3-sankey";
  import sankeyMixin from "../mixins/sankey-mixin";
  import SankeyNode from "./Sankey/SankeyNode.vue";
  import NodeTitle from "./Sankey/NodeTitle.vue";
  import SankeyLink from "./Sankey/SankeyLink.vue";
  import SankeyGradient from "./Sankey/SankeyGradient.vue";

  export default {
    name: "SankeyMain",
    components: { SankeyNode, NodeTitle, SankeyLink, SankeyGradient },
    props: {
      data: Object
    },
    mixins: [sankeyMixin],
    data: () => ({
      width: 1780,
      height: 8500,
      nodes: [],
      links: [],
      sankey: null
    }),
    methods: {
      updateSankey() {
        this.sankey = sankey()
          .nodeAlign(sankeyJustify)
          .nodeWidth(10)
          .nodePadding(10)
          .extent([[0, 20], [this.width, this.height]]);
        const { nodes, links } = this.sankey(this.data);
        this.nodes = nodes;
        this.links = links;
      }
    },
    computed: {
      colors() {
        return d3.interpolateCividis;
      },
      length() {
        return this.nodes.length;
      }
    },
    watch: {
      data: {
        deep: false,
        immediate: true,
        handler(data) {
          if (!data) return;
          this.updateSankey();
        }
      }
    }
  };
  </script>