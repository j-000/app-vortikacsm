# Use the official Nginx image as the final image
FROM nginx

# Copy conf file
COPY ./nginx.conf /etc/nginx/nginx.conf

# Copy the vuejs prod built files to the Nginx public directory
COPY ./dist /usr/share/nginx/html

# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]