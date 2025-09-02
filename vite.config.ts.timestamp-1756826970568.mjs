// vite.config.ts
import { resolve } from "path";
import { defineConfig } from "file:///mnt/c/Users/inumo/react-scheduler-joseph/node_modules/vite/dist/node/index.js";
import react from "file:///mnt/c/Users/inumo/react-scheduler-joseph/node_modules/@vitejs/plugin-react/dist/index.mjs";
import dts from "file:///mnt/c/Users/inumo/react-scheduler-joseph/node_modules/vite-plugin-dts/dist/index.mjs";
import { visualizer } from "file:///mnt/c/Users/inumo/react-scheduler-joseph/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import svgr from "file:///mnt/c/Users/inumo/react-scheduler-joseph/node_modules/vite-plugin-svgr/dist/index.mjs";
import "file:///mnt/c/Users/inumo/react-scheduler-joseph/node_modules/tailwindcss/dist/lib.mjs";
var __vite_injected_original_dirname = "/mnt/c/Users/inumo/react-scheduler-joseph";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvbW50L2MvVXNlcnMvaW51bW8vcmVhY3Qtc2NoZWR1bGVyLWpvc2VwaFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL21udC9jL1VzZXJzL2ludW1vL3JlYWN0LXNjaGVkdWxlci1qb3NlcGgvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL21udC9jL1VzZXJzL2ludW1vL3JlYWN0LXNjaGVkdWxlci1qb3NlcGgvdml0ZS5jb25maWcudHNcIjsvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZW1wdHktZnVuY3Rpb24gKi9cclxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcclxuaW1wb3J0IGR0cyBmcm9tIFwidml0ZS1wbHVnaW4tZHRzXCI7XHJcbmltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tIFwicm9sbHVwLXBsdWdpbi12aXN1YWxpemVyXCI7XHJcbmltcG9ydCBzdmdyIGZyb20gXCJ2aXRlLXBsdWdpbi1zdmdyXCI7XHJcbmltcG9ydCBcInRhaWx3aW5kY3NzXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIFwiQFwiOiByZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgcGx1Z2luczogW1xyXG4gICAgcmVhY3Qoe1xyXG4gICAgICBiYWJlbDoge1xyXG4gICAgICAgIGVudjoge1xyXG4gICAgICAgICAgcHJvZHVjdGlvbjoge1xyXG4gICAgICAgICAgICBwbHVnaW5zOiBbW1wiYmFiZWwtcGx1Z2luLXN0eWxlZC1jb21wb25lbnRzXCIsIHsgZGlzcGxheU5hbWU6IGZhbHNlLCBwdXJlOiB0cnVlIH1dXVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGRldmVsb3BtZW50OiB7XHJcbiAgICAgICAgICAgIHBsdWdpbnM6IFtbXCJiYWJlbC1wbHVnaW4tc3R5bGVkLWNvbXBvbmVudHNcIiwgeyBkaXNwbGF5TmFtZTogdHJ1ZSwgcHVyZTogdHJ1ZSB9XV1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pLFxyXG4gICAgZHRzKHtcclxuICAgICAgcm9sbHVwVHlwZXM6IHRydWVcclxuICAgIH0pLFxyXG4gICAgc3ZncigpLFxyXG4gICAgdmlzdWFsaXplcih7XHJcbiAgICAgIHRlbXBsYXRlOiBcInRyZWVtYXBcIlxyXG4gICAgfSlcclxuICBdLFxyXG4gIGJ1aWxkOiB7XHJcbiAgICBsaWI6IHtcclxuICAgICAgZW50cnk6IHJlc29sdmUoX19kaXJuYW1lLCBcInNyYy9pbmRleC50c1wiKSxcclxuICAgICAgbmFtZTogXCJyZWFjdC1zY2hlZHVsZXJcIixcclxuICAgICAgZmlsZU5hbWU6IFwiaW5kZXhcIlxyXG4gICAgfSxcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgZXh0ZXJuYWw6IFtcInJlYWN0XCIsIFwicmVhY3QtZG9tXCIsIFwicmVhY3QvanN4LXJ1bnRpbWVcIl0sXHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIGdsb2JhbHM6IHtcclxuICAgICAgICAgIHJlYWN0OiBcIlJlYWN0XCIsXHJcbiAgICAgICAgICBcInJlYWN0LWRvbVwiOiBcIlJlYWN0RE9NXCIsXHJcbiAgICAgICAgICBcInJlYWN0L2pzeC1ydW50aW1lXCI6IFwicmVhY3QvanN4LXJ1bnRpbWVcIlxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBob3N0OiBcIjAuMC4wLjBcIlxyXG4gIH1cclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxTQUFTLGVBQWU7QUFDeEIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sU0FBUztBQUNoQixTQUFTLGtCQUFrQjtBQUMzQixPQUFPLFVBQVU7QUFDakIsT0FBTztBQVBQLElBQU0sbUNBQW1DO0FBU3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDakM7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsTUFDSixPQUFPO0FBQUEsUUFDTCxLQUFLO0FBQUEsVUFDSCxZQUFZO0FBQUEsWUFDVixTQUFTLENBQUMsQ0FBQyxrQ0FBa0MsRUFBRSxhQUFhLE9BQU8sTUFBTSxLQUFLLENBQUMsQ0FBQztBQUFBLFVBQ2xGO0FBQUEsVUFDQSxhQUFhO0FBQUEsWUFDWCxTQUFTLENBQUMsQ0FBQyxrQ0FBa0MsRUFBRSxhQUFhLE1BQU0sTUFBTSxLQUFLLENBQUMsQ0FBQztBQUFBLFVBQ2pGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELElBQUk7QUFBQSxNQUNGLGFBQWE7QUFBQSxJQUNmLENBQUM7QUFBQSxJQUNELEtBQUs7QUFBQSxJQUNMLFdBQVc7QUFBQSxNQUNULFVBQVU7QUFBQSxJQUNaLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxLQUFLO0FBQUEsTUFDSCxPQUFPLFFBQVEsa0NBQVcsY0FBYztBQUFBLE1BQ3hDLE1BQU07QUFBQSxNQUNOLFVBQVU7QUFBQSxJQUNaO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDYixVQUFVLENBQUMsU0FBUyxhQUFhLG1CQUFtQjtBQUFBLE1BQ3BELFFBQVE7QUFBQSxRQUNOLFNBQVM7QUFBQSxVQUNQLE9BQU87QUFBQSxVQUNQLGFBQWE7QUFBQSxVQUNiLHFCQUFxQjtBQUFBLFFBQ3ZCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
