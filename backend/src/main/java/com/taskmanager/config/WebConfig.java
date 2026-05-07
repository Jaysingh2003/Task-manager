package com.taskmanager.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        // Don't intercept API calls
                        if (resourcePath.startsWith("api/")) return null;

                        Resource resource = location.createRelative(resourcePath);
                        // If the file exists (js, css, images) serve it directly
                        // Otherwise return index.html so React Router handles the path
                        return resource.exists() && resource.isReadable()
                                ? resource
                                : new ClassPathResource("/static/index.html");
                    }
                });
    }
}
