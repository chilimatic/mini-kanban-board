<?php
/**
 * Created by PhpStorm.
 * User: shadowdroid
 * Date: 25/09/2014
 * Time: 20:18
 */

namespace minikanban\app\module\main\controller;

/**
 * Class Index
 * @package \minikanban\app\default\controller
 */
class Index extends Application
{

    public function indexAction(){
        $this->setView(new \chilimatic\lib\view\PHtml());
        $this->getView()->pageTitle = 'chilimatic';
    }

}