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

