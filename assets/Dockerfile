
FROM golang:1.14.0 AS builder

ENV GOPATH /build/_local
ENV GO111MODULE=on
ENV GOPROXY="https://proxy.golang.org"

WORKDIR /build
COPY . .
RUN go install -v ./...

RUN ls /build/_local/bin

FROM debian:buster-slim  

RUN DEBIAN_FRONTEND=noninteractive apt-get update && apt-get install -y --no-install-recommends \
      ca-certificates && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /etc/ssl/certs/* 

ARG entrypoint
COPY --from=builder /build/_local/bin /usr/local/bin
RUN echo "#!/bin/sh\n${entrypoint} \"\$@\"" > /bin/entrypoint.sh && chmod +x /bin/entrypoint.sh
ENTRYPOINT [ "/bin/entrypoint.sh" ]