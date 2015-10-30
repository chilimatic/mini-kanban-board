<?php

/**
 * Service Collection for the application
 */
    return
    [
        'config' => function($setting = []) {
            return \chilimatic\lib\config\Config::getInstance($setting);
        },
        'view' => function($setting = []) {
            return new \chilimatic\lib\view\PHtml();
        },
        'db' => function($setting = []) {
            return new PDO($setting['dns'], $setting['username'], $setting['password']);
        },
        'request-handler' => function($setting = []) {
            return \chilimatic\lib\request\Handler::getInstance();
        },
        'application-handler' => function($setting = []) {
            return new chilimatic\lib\handler\HTTPHandler($setting);
        },
        'routing' => function($setting = []) {
            return new \chilimatic\lib\route\Router($setting['type']);
        },
        'session' => function($setting = []){
            return new chilimatic\lib\session\handler\Session(
                chilimatic\lib\session\engine\Factory::make(@$setting['type'], @$setting['param'])
            );
        },
        'template-resolver' => function ($setting = []) {
            return new chilimatic\lib\view\resolver\templatePathStack($setting);
        },
        'cache' => function($setting = []) {
            return chilimatic\lib\cache\engine\CacheFactory::make($setting['type'], isset($setting['setting']) ? $setting['setting'] : null);
        },
        'error-handler' => function($setting = []) {
            return new \chilimatic\lib\error\Handler(
                new \chilimatic\lib\log\client\PrintOutWebTemplate()
            );
        },
    ];