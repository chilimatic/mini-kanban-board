<?php
/**
 *
 * @author j
 * Date: 12/29/14
 * Time: 5:49 PM
 *
 * File: chilimatic.class.php
 */

namespace minikanban\app\module\main\controller;

use chilimatic\lib\di\ClosureFactory;
use chilimatic\lib\view\AbstractView;

class Application extends \chilimatic\lib\controller\HTTPController
{
    /**
     * @var mixed
     */
    protected $session;


    /**
     * @param AbstractView $view
     */
    public function __construct(AbstractView $view = null) {

        $config = ClosureFactory::getInstance()->get('config');

        $this->session = ClosureFactory::getInstance()->get('session',
            [
                'type' => 'cache',
                'param' =>
                [
                    'session_cache' => $config->get('session_cache')
                ]
            ],
            true
        );

        $this->loadUserFromSession();
        parent::__construct();
    }

    /**
     * @return bool
     */
    public function loadUserFromSession()
    {

        return true;
    }


    /**
     * @param $reason
     * @param $msg
     * @param $jsCallback
     * @param $data
     *
     * @view \chilimatic\lib\view\Json
     *
     * @return void
     */
    protected function errorMessage($reason, $msg, $jsCallback = null, $data = null)
    {
        $this->getView()->response = [
            'error' =>
                [
                    'reason' => $reason,
                    'msg' => $msg
                ],
            'call' => $jsCallback,
            'data' => $data
        ];
    }


    /**
     * @param string $reason
     * @param string $msg
     * @param string $jsCallback
     * @param mixed $data
     *
     * @return void
     */
    protected function successMessage($reason, $msg, $jsCallback = null, $data = null)
    {
        $this->getView()->response = [
            'success' => $reason,
            'msg' => $msg,
            'call' => $jsCallback,
            'data' => $data
        ];
    }
}