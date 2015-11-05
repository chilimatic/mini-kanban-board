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
        'mongo' => function ($settings = []) {
            return new MongoClient($settings['dsn'], $settings['options'], $settings['driver_options']);
        },
        'user-db' => function($settings = []) {
            $connection =  \chilimatic\lib\di\ClosureFactory::getInstance()->get('mongo', [], true);
            return $connection->user;
        },
        'user-collection' => function ($settings = []) {
            $db = \chilimatic\lib\di\ClosureFactory::getInstance()->get('user-db', [], true);
            return $db->createCollection('user');
        },
        'document-manager' => function($settings = []) {
            return new \chilimatic\lib\database\mongo\odm\DocumentManager(
                \chilimatic\lib\di\ClosureFactory::getInstance()->get('mongo', [], true),
                new \chilimatic\lib\parser\annotation\AnnotationOdmParser()
            );
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
        'authentication-service' => function($setting = []){
            return new \minikanban\app\module\user\service\Authentication(
                \chilimatic\lib\di\ClosureFactory::getInstance()->get('session', [], true)
            );
        }
    ];