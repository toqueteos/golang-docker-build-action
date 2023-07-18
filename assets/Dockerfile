
ARG debian_version=bullseye-slim
FROM golang:1 AS builder

ENV GOPATH /build/_local
ENV GO111MODULE=on
ENV GOPROXY="https://proxy.golang.org"

ARG packages
RUN if [ -n "$packages" ]; then \
      DEBIAN_FRONTEND=noninteractive \
      apt-get update && \
      apt-get install -y --no-install-recommends ${packages} && \
      apt-get clean && \
      rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*; \
    fi

WORKDIR /build
COPY . .

ARG tags
ARG goprivate
ENV GOPRIVATE="${goprivate}"
RUN go install -tags "${tags}" ./...

RUN ls /build/_local/bin

FROM debian:${debian_version}

ARG packages
RUN DEBIAN_FRONTEND=noninteractive \
    apt-get update && \
    apt-get install -y --no-install-recommends ca-certificates ${packages} && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ARG entrypoint
COPY --from=builder /build/_local/bin /usr/local/bin
RUN echo "#!/bin/sh\n${entrypoint} \"\$@\"" > /bin/entrypoint.sh && chmod +x /bin/entrypoint.sh
ENTRYPOINT [ "/bin/entrypoint.sh" ]
