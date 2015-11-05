<?php
/**
 *
 * @author j
 * Date: 10/28/15
 * Time: 11:09 AM
 *
 * File: index.php
 */

error_reporting(E_ERROR | E_WARNING | E_PARSE);
ini_set("display_errors", 1);

require_once '../vendor/autoload.php';

define('APPLICATION_PATH', realpath('../'));

try {
    /**
     * the $dispatcher is created in the following script below
     */
    require_once APPLICATION_PATH . '/app/general/init.php';

    $dispatcher->set('mongo', function($settings) use ($dispatcher) {
        $config = $dispatcher->get('config');
        return new MongoClient($config->get('mongo-dsn'));
    });


    $application = new \chilimatic\lib\application\HTTPMVC($dispatcher, $dispatcher->get('config', [], true));
    // this is step so people can inject
    $application->init();
    echo $application->getHandler()->getContent();
}
catch (Exception $e)
{

    if (isset($dispatcher)) {
        /**
         * @var $eh \chilimatic\lib\error\Handler
         */
        $eh = $dispatcher->get('error-handler', null, true)->getClient();
        if ($eh->showError()) {
            $eh->log(
                $e->getMessage(),
                $e->getTraceAsString()
            )->send();
        }
    } else {
        echo _('nothing to concern you with :)');
    }
}