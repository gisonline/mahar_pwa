//var config = [6630153, 4344867, 14, 'EPSG:32640', 'mashhad', 'http://172.20.118.173/avl/servlet/tablet.php', 'localVector', 0.19];//mashhad php
//var config = [6630153, 4344867, 14, 'EPSG:32640', 'mashhad', 'http://217.219.86.84:808/avl/servlet/tablet.php', 'onlineFFO', 0.19, 'http://217.219.86.84:808/avl/servlet/upload.php'];//mashhad php
//var config = [5840649, 3457173, 11, 'EPSG:32639', 'shiraz', 'https://125.shiraz.ir/tablet/servlet/tablet.php', 'onlineFFO', 0.19, 'https://125.shiraz.ir/tablet/servlet/upload.php'];// php
//var config = [5418810, 3675810, 11, 'EPSG:32639', 'ahwaz', 'http://91.108.152.86/avl/servlet/tablet.php', 'onlineFFO', 0.19, 'http://91.108.152.86/avl/servlet//upload.php'];// ahvaz apn
var config = [6049218.983651388, 3748246.8650292833, 11, 'EPSG:4326', 'yazd', 'https://mahar.yazd.ir:8081/avl/servlet/tablet.php', 'onlineFFO', 0.19, 'https://mahar.yazd.ir:8081/avl/servlet/upload.php'];// 51.416159  33.982281
//var config = [5399043, 4393345, 13, 'EPSG:4326', 'zanjan', 'http://mahar.zanjan.ir:8081/servlet/tablet.php', 'onlineFFO', 0.19, 'http://mahar.zanjan.ir:8081/servlet/upload.php'];
//var config = [5399043, 4393345, 13, 'EPSG:4326', 'zanjan', 'http://89.42.210.15:8085/mahar/avl/servlet/tablet.php', 'onlineFFO', 0.19, 'http://89.42.210.15:8085/mahar/avl/servlet/upload.php'];

//var config = [6060550, 4415836, 13, 'EPSG:4326', 'gorgan', 'http://10.75.2.25/avl/servlet/tablet.php', 'onlineFFO', 0.19, 'http://10.75.2.25/avl/servlet/upload.php'];

//var config = [5723620, 4026423, 11, 'EPSG:32639', 'kashan', 'http://192.168.1.38/avl/servlet/tablet.php', 'onlineFFO', 0.19, 'http://192.168.1.38/avl/servlet/upload.php'];// 51.416159  33.982281
//var config = [5418810, 3675810, 11, 'EPSG:32639', 'ahwaz', 'https://mahar.ahvaz.ir/avl/servlet/tablet.php', 'onlineFFO', 0.19, 'https://mahar.ahvaz.ir/avl/servlet/upload.php'];
proj4.defs([
  [
    'EPSG:32640',
    '+proj=utm +zone=40 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'],
  [
    'EPSG:32639',
    '+proj=utm +zone=39 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'
  ]
]);