FROM ultralytics/yolov5:latest 

WORKDIR /app 

COPY ./src/ .

RUN pip install flask 

RUN mkdir /data

EXPOSE 2000 

# 빈 bash 실행
CMD ["/bin/bash"]
