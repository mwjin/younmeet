pushd frontend/dist
rm -r dist.zip
zip -r dist.zip .
popd
scp -i ../swpp.pem ./frontend/dist/dist.zip ubuntu@ec2-52-78-6-209.ap-northeast-2.compute.amazonaws.com:/home/ubuntu/dist.zip
ssh -i ../swpp.pem ubuntu@ec2-52-78-6-209.ap-northeast-2.compute.amazonaws.com \
    rm -rf /home/ubuntu/swpp/frontend/dist && unzip /home/ubuntu/dist.zip -d /home/ubuntu/swpp/frontend/dist
