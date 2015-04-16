<?php

sleep(1);

print_r($_GET);

if($_GET['param'] == '2'){
    echo '<a href="demo.php?param=5" class="ajax-call" data-target="#link">prueba de link ajax</a>';
    echo '<div id="link"></div>';
}else{
    echo 'hola';
}