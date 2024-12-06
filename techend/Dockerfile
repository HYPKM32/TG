FROM ultralytics/yolov5:latest 

WORKDIR /app 

COPY ./src/ .

RUN pip install flask 

RUN mkdir /data
RUN mkdir /Output
# output 폴더 추가

EXPOSE 2000 

# 빈 bash 실행
CMD ["/bin/bash"]
