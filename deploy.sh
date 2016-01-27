scp -i ../keys/aws-key.ppk ./distribution/target/distribution-1.0-SNAPSHOT-bin/*.* ec2-user@54.164.150.72:/home/ec2-user/wimb
scp -i ../keys/aws-key.ppk ./src/db ec2-user@54.164.150.72:/home/ec2-user/wimb

