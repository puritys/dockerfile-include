# dockerfile-include

* npm install -g dockerfile-include


Create a docker file with include instruction

```
FROM centos7

INCLUDE centos.doc
```


Execute docker build command
```
dockerfile-include -i centos.doc -o Dockerfile
docker build .
```



## Functionalities

* Add a new instruction "include" to include other Dockerfile.
* chang the file path of instruction COPY.

