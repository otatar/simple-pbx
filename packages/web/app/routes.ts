import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./routes/layout/layout.tsx", [
    index("routes/dashboard.tsx"),
    route("extensions", "routes/extensions/extensions.tsx", [
      layout("routes/layout/modal-route-layout.tsx", [
        route("new", "routes/extensions/extension-new.tsx"),
        route(":id", "routes/extensions/extension.tsx"),
      ]),
    ]),
    route("trunks", "routes/trunks/index.tsx", [
      route("", "routes/trunks/trunks.tsx"),
      route("new", "routes/trunks/trunk-new.tsx"),
      route(":id", "routes/trunks/trunk.tsx"),
    ]),
    route("number-manipulations", "routes/number-manipulations/index.tsx", [
      layout(
        "routes/layout/modal-route-layout.tsx",
        { id: "number-manipulation" },
        [
          route("new", "routes/number-manipulations/num-manipulation-new.tsx"),
          route(":id", "routes/number-manipulations/num-manipulation.tsx"),
        ],
      ),
    ]),
    route("class-of-service", "routes/class-of-service/index.tsx", [
      route("new", "routes/class-of-service/new.tsx"),
      route(":id", "routes/class-of-service/cos.tsx"),
    ]),
    route("outbound-routing", "routes/outbound-routing/index.tsx", [
      layout(
        "routes/layout/modal-route-layout.tsx",
        { id: "outbound-routing" },
        [
          route("new", "routes/outbound-routing/new.tsx"),
          route(":id", "routes/outbound-routing/outbound-route.tsx"),
        ],
      ),
    ]),
    route("inbound-routing", "routes/inbound-routing/index.tsx", [
      layout(
        "routes/layout/modal-route-layout.tsx",
        { id: "inbound-routing" },
        [
          route("new", "routes/inbound-routing/new.tsx"),
          route(":id", "routes/inbound-routing/inbound-route.tsx"),
        ],
      ),
    ]),
    route("cdr", "routes/cdr/index.tsx"),
  ]),
] satisfies RouteConfig;
