ARG builder_image_tag=builder
ARG tags
ARG runner_image_tag=runner
ARG entrypoint

FROM ghcr.io/remotely-works/base-docker-images:${builder_image_tag} AS builder
WORKDIR /build
COPY . .
RUN go install -tags "${tags}" ./...
RUN ls /build/_local/bin

FROM ghcr.io/remotely-works/base-docker-images:${runner_image_tag}
COPY --from=builder /build/_local/bin /usr/local/bin
RUN echo "#!/bin/sh\n${entrypoint} \"\$@\"" > /bin/entrypoint.sh && chmod +x /bin/entrypoint.sh
ENTRYPOINT [ "/bin/entrypoint.sh" ]
