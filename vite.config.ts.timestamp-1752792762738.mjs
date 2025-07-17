// vite.config.ts
import { resolve } from "path";
import { defineConfig } from "file:///C:/Users/inumo/react-scheduler-joseph/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/inumo/react-scheduler-joseph/node_modules/@vitejs/plugin-react/dist/index.mjs";
import dts from "file:///C:/Users/inumo/react-scheduler-joseph/node_modules/vite-plugin-dts/dist/index.mjs";
import { visualizer } from "file:///C:/Users/inumo/react-scheduler-joseph/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import svgr from "file:///C:/Users/inumo/react-scheduler-joseph/node_modules/vite-plugin-svgr/dist/index.mjs";
import "file:///C:/Users/inumo/react-scheduler-joseph/node_modules/tailwindcss/dist/lib.mjs";
var __vite_injected_original_dirname = "C:\\Users\\inumo\\react-scheduler-joseph";
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "./src")
    }
  },
  plugins: [
    react({
      babel: {
        env: {
          production: {
            plugins: [["babel-plugin-styled-components", { displayName: false, pure: true }]]
          },
          development: {
            plugins: [["babel-plugin-styled-components", { displayName: true, pure: true }]]
          }
        }
      }
    }),
    dts({
      rollupTypes: true
    }),
    svgr(),
    visualizer({
      template: "treemap"
    })
  ],
  build: {
    lib: {
      entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "react-scheduler",
      fileName: "index"
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "react/jsx-runtime"
        }
      }
    }
  },
  server: {
    host: "0.0.0.0"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxpbnVtb1xcXFxyZWFjdC1zY2hlZHVsZXItam9zZXBoXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxpbnVtb1xcXFxyZWFjdC1zY2hlZHVsZXItam9zZXBoXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9pbnVtby9yZWFjdC1zY2hlZHVsZXItam9zZXBoL3ZpdGUuY29uZmlnLnRzXCI7LyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWVtcHR5LWZ1bmN0aW9uICovXHJcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XHJcbmltcG9ydCBkdHMgZnJvbSBcInZpdGUtcGx1Z2luLWR0c1wiO1xyXG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSBcInJvbGx1cC1wbHVnaW4tdmlzdWFsaXplclwiO1xyXG5pbXBvcnQgc3ZnciBmcm9tIFwidml0ZS1wbHVnaW4tc3ZnclwiO1xyXG5pbXBvcnQgXCJ0YWlsd2luZGNzc1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICBcIkBcIjogcmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIilcclxuICAgIH1cclxuICB9LFxyXG4gIHBsdWdpbnM6IFtcclxuICAgIHJlYWN0KHtcclxuICAgICAgYmFiZWw6IHtcclxuICAgICAgICBlbnY6IHtcclxuICAgICAgICAgIHByb2R1Y3Rpb246IHtcclxuICAgICAgICAgICAgcGx1Z2luczogW1tcImJhYmVsLXBsdWdpbi1zdHlsZWQtY29tcG9uZW50c1wiLCB7IGRpc3BsYXlOYW1lOiBmYWxzZSwgcHVyZTogdHJ1ZSB9XV1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBkZXZlbG9wbWVudDoge1xyXG4gICAgICAgICAgICBwbHVnaW5zOiBbW1wiYmFiZWwtcGx1Z2luLXN0eWxlZC1jb21wb25lbnRzXCIsIHsgZGlzcGxheU5hbWU6IHRydWUsIHB1cmU6IHRydWUgfV1dXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KSxcclxuICAgIGR0cyh7XHJcbiAgICAgIHJvbGx1cFR5cGVzOiB0cnVlXHJcbiAgICB9KSxcclxuICAgIHN2Z3IoKSxcclxuICAgIHZpc3VhbGl6ZXIoe1xyXG4gICAgICB0ZW1wbGF0ZTogXCJ0cmVlbWFwXCJcclxuICAgIH0pXHJcbiAgXSxcclxuICBidWlsZDoge1xyXG4gICAgbGliOiB7XHJcbiAgICAgIGVudHJ5OiByZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvaW5kZXgudHNcIiksXHJcbiAgICAgIG5hbWU6IFwicmVhY3Qtc2NoZWR1bGVyXCIsXHJcbiAgICAgIGZpbGVOYW1lOiBcImluZGV4XCJcclxuICAgIH0sXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIGV4dGVybmFsOiBbXCJyZWFjdFwiLCBcInJlYWN0LWRvbVwiLCBcInJlYWN0L2pzeC1ydW50aW1lXCJdLFxyXG4gICAgICBvdXRwdXQ6IHtcclxuICAgICAgICBnbG9iYWxzOiB7XHJcbiAgICAgICAgICByZWFjdDogXCJSZWFjdFwiLFxyXG4gICAgICAgICAgXCJyZWFjdC1kb21cIjogXCJSZWFjdERPTVwiLFxyXG4gICAgICAgICAgXCJyZWFjdC9qc3gtcnVudGltZVwiOiBcInJlYWN0L2pzeC1ydW50aW1lXCJcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogXCIwLjAuMC4wXCJcclxuICB9XHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsU0FBUyxlQUFlO0FBQ3hCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUNsQixPQUFPLFNBQVM7QUFDaEIsU0FBUyxrQkFBa0I7QUFDM0IsT0FBTyxVQUFVO0FBQ2pCLE9BQU87QUFQUCxJQUFNLG1DQUFtQztBQVN6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ2pDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLE1BQ0osT0FBTztBQUFBLFFBQ0wsS0FBSztBQUFBLFVBQ0gsWUFBWTtBQUFBLFlBQ1YsU0FBUyxDQUFDLENBQUMsa0NBQWtDLEVBQUUsYUFBYSxPQUFPLE1BQU0sS0FBSyxDQUFDLENBQUM7QUFBQSxVQUNsRjtBQUFBLFVBQ0EsYUFBYTtBQUFBLFlBQ1gsU0FBUyxDQUFDLENBQUMsa0NBQWtDLEVBQUUsYUFBYSxNQUFNLE1BQU0sS0FBSyxDQUFDLENBQUM7QUFBQSxVQUNqRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxJQUFJO0FBQUEsTUFDRixhQUFhO0FBQUEsSUFDZixDQUFDO0FBQUEsSUFDRCxLQUFLO0FBQUEsSUFDTCxXQUFXO0FBQUEsTUFDVCxVQUFVO0FBQUEsSUFDWixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsS0FBSztBQUFBLE1BQ0gsT0FBTyxRQUFRLGtDQUFXLGNBQWM7QUFBQSxNQUN4QyxNQUFNO0FBQUEsTUFDTixVQUFVO0FBQUEsSUFDWjtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsVUFBVSxDQUFDLFNBQVMsYUFBYSxtQkFBbUI7QUFBQSxNQUNwRCxRQUFRO0FBQUEsUUFDTixTQUFTO0FBQUEsVUFDUCxPQUFPO0FBQUEsVUFDUCxhQUFhO0FBQUEsVUFDYixxQkFBcUI7QUFBQSxRQUN2QjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
